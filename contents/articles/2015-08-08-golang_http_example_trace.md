# [Golang] HTTP example --> code tracing

練習追蹤golang source, 順便熟悉一下golang語法, 以及探索 `net/http`函式庫。

## Example

來自於 [golang wiki](https://golang.org/doc/articles/wiki/#tmp_3):

``` go
package main

import (
    "fmt"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hi there, I love %s!", r.URL.Path[1:])
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}
```

執行結果: 

``` bash
$ curl http://localhost:8080/monkeys
Hi there, I love monkeys!
```

看來我們程式的動作包括: 

  - import `net/http` package。
  - 定義`handler` function。函式本身引入兩個參數: `http.ResponseWriter`和指向一個`http.Request`的指標。
  - 在`main()`function, 我們使用`http.HandleFunc(<path>, <function>)`來將所有連到`/`的requests導到我們的`handler` function。
  - 最後, 我們啟動一個在`localhost:8080`的http server。這個server並未指定任何handler(使用預設的`DefaultServeMux`當作我們的multiplexer)


## http.ResponseWriter

`handler` function要傳入兩個參數, 其中一個是 [http.ResponseWriter](http://golang.org/pkg/net/http/#ResponseWriter) 其source code如下:

``` go
//A ResponseWriter interface is used by an HTTP handler to contruct an HTTP response.
type ResponseWriter interface {
  // Header returns the header map that will be sent by WriteHeader.
  // Changing the header after a call to WriteHeader (or Write) has
  // no effect.
  Header() Header

  // Write writes the data to the connection as part of an HTTP reply.
  // If WriteHeader has not yet been called, Write calls WriteHeader(http.StatusOK)
  // before writing the data.  If the Header does not contain a
  // Content-Type line, Write adds a Content-Type set to the result of passing
  // the initial 512 bytes of written data to DetectContentType.
  Write([]byte) (int, error)

  // WriteHeader sends an HTTP response header with status code.
  // If WriteHeader is not called explicitly, the first call to Write
  // will trigger an implicit WriteHeader(http.StatusOK).
  // Thus explicit calls to WriteHeader are mainly used to
  // send error codes.
  WriteHeader(int)
}
```

`http.ResponseWriter`為一個interface, 用在HTTP handler裏面, 用來建立一個HTTP respose。

這個interface定義了3個行為： 

  - `Write`： 可以寫入資料到connection, 當作HTTP reply的一部份
  - `WriteHeader`: 傳送一個包含status code的HTTP response header
  - `Header`: 傳回一個header map給`WriterHeader`傳送

如果沒有明確呼叫`WriteHeader`, `Write`會在寫入資料前自動呼叫`WriteHeader(http.StatusOK)`, 如果`Header`沒有包含`Content-Type`, `Write`會依照寫入資料的前512bytes來判斷content-type。

### JSON handler

理解`http.ResponseWriter` interface type後, 我們可以舉一反三, 將原來handler改寫, 讓其傳回JSON: 

``` go
import "json"

func handler(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json; charset=utf-8") 

  myItems := []string{"item1", "item2", "item3"}
  a, _ := json.Marshal(myItems)

  w.Write(a)  
}
```

## http.Request

[http.Request](http://golang.org/pkg/net/http/#Request) 表示由client發送, server所收到的一個HTTP request。

就是一個表示initail request的struct type, 註解直接看source, 簡寫如下: 

``` go
type Request struct {
  Method string
  URL *url.URL
  Proto      string // "HTTP/1.0"
  ProtoMajor int    // 1
  ProtoMinor int    // 0
  Header Header
  Body io.ReadCloser
  ContentLength int64
  TransferEncoding []string
  Close bool
  Host string
  Form url.Values
  PostForm url.Values
  MultipartForm *multipart.Form
  Trailer Header
  RemoteAddr string
  RequestURI string
  TLS *tls.ConnectionState
}
```

The field semantics differ slightly between client and server usage. In addition to the notes on the fields below, see the documentation for Request.Write and RoundTripper.


## http.HandleFunc

`http.HandleFunc`在 `DefaultServeMux`的 **ServeMux** [multiplexer](https://en.wikipedia.org/wiki/Multiplexing) 所對應的路徑(pattern)註冊一個handler function。

source code:

``` go
func HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
  DefaultServeMux.HandleFunc(pattern, handler)
}
```

`DefaultServeMux`: 

``` go
// DefaultServeMux is the default ServeMux used by Serve.
var DefaultServeMux = NewServeMux()
```

`NewServeMux`: 

``` go
// NewServeMux allocates and returns a new ServeMux.
func NewServeMux() *ServeMux { return &ServeMux{m: make(map[string]muxEntry)} }
```

`ServeMux`以及`muxEntry` struct:

``` go
//ServeMux also takes care of sanitizing the URL request path,
// redirecting any request containing . or .. elements to an
// equivalent .- and ..-free URL.
type ServeMux struct {
  mu    sync.RWMutex
  m     map[string]muxEntry
  hosts bool // whether any patterns contain hostnames
}

type muxEntry struct {
  explicit bool
  h        Handler
  pattern  string
}
```

## ServeMux 

由上可看到: 

``` go
type ServeMux struct {
  // contains filtered or unexported fields
}
```

翻譯自官網定義: 

`ServeMux`是一個HTTP request multiplexer, 會對進來的request跟已經註冊的一堆patterns做比對,  呼叫對應的handler。

`/favicon.ico`是固定的路徑(rooted path), 和`/images/`是表示為rooted subtrees, 是不同的。


較長的URL pattern有較高的優先權, 例如我們有註冊兩個handler是給`/images/`和`/images/thumbnails/`的, 那只要request路徑是`/images/thumbnails/`開始的, 就會呼叫註冊在`/images/thumbnails/`的handler, 那其他`/images/`的handler才會接收其他`/images/`的requests。

所有沒有符合已經註冊的patterns的路徑就會跑到`/`。


## http.ListenAndServe

``` go
http.ListenAndServe(":8080", nil)
```

`http.ListenAndServe` 監聽 TCP network address, 然後呼叫帶著handler的服務來處理連線進來的request。

`Handler`通常為`nil`, 表示預設使用了`DefaultServeMux`。

source code如下: 

``` go
func ListenAndServe(addr string, handler Handler) error {
  server := &Server{Addr: addr, Handler: handler}
  return server.ListenAndServe()
}
```

看來我們取得了一個新的型別為`Server` struct的`server`, 然後呼叫`server`的`ListenAndServe()` method。

type `Server` struct: 

``` go
// A Server defines parameters for running an HTTP server.
// The zero value for Server is a valid configuration.
type Server struct {
  Addr           string        // TCP address to listen on, ":http" if empty
  Handler        Handler       // handler to invoke, http.DefaultServeMux if nil
  ReadTimeout    time.Duration // maximum duration before timing out read of the request
  WriteTimeout   time.Duration // maximum duration before timing out write of the response
  MaxHeaderBytes int           // maximum size of request headers, DefaultMaxHeaderBytes if 0
  TLSConfig      *tls.Config   // optional TLS config, used by ListenAndServeTLS

  // TLSNextProto optionally specifies a function to take over
  // ownership of the provided TLS connection when an NPN
  // protocol upgrade has occurred.  The map key is the protocol
  // name negotiated. The Handler argument should be used to
  // handle HTTP requests and will initialize the Request's TLS
  // and RemoteAddr if not already set.  The connection is
  // automatically closed when the function returns.
  TLSNextProto map[string]func(*Server, *tls.Conn, Handler)

  // ConnState specifies an optional callback function that is
  // called when a client connection changes state. See the
  // ConnState type and associated constants for details.
  ConnState func(net.Conn, ConnState)

  // ErrorLog specifies an optional logger for errors accepting
  // connections and unexpected behavior from handlers.
  // If nil, logging goes to os.Stderr via the log package's
  // standard logger.
  ErrorLog *log.Logger
  // contains filtered or unexported fields
}
```

`func (srv *Server) ListenAndServe() error`: 

``` go
func (srv *Server) ListenAndServe() error {
  addr := srv.Addr
  if addr == "" {
    addr = ":http"
  }
  ln, err := net.Listen("tcp", addr)
  if err != nil {
    return err
  }
  return srv.Serve(tcpKeepAliveListener{ln.(*net.TCPListener)})
}
```

如果address為空, 就用`:http`替代, 利用`net.Listen`建立TCP連線, 利用`srv.Serve()`接收傳入的連線, 建立新的service goroutine。 service goroutine會讀取requests然後呼叫`srv.Handler`來處理回應他們。

`func (srv *Server) Serve(l net.Listener) error`:

``` go
func (srv *Server) Serve(l net.Listener) error {
  defer l.Close()
  var tempDelay time.Duration // how long to sleep on accept failure
  for {
    rw, e := l.Accept()
    if e != nil {
      if ne, ok := e.(net.Error); ok && ne.Temporary() {
        if tempDelay == 0 {
          tempDelay = 5 * time.Millisecond
        } else {
          tempDelay *= 2
        }
        if max := 1 * time.Second; tempDelay > max {
          tempDelay = max
        }
        srv.logf("http: Accept error: %v; retrying in %v", e, tempDelay)
        time.Sleep(tempDelay)
        continue
      }
      return e
    }
    tempDelay = 0
    c, err := srv.newConn(rw)
    if err != nil {
      continue
    }
    c.setState(c.rwc, StateNew) // before Serve can return
    go c.serve()
  }
}
```

`func (srv *Server) newConn(rwc net.Conn) (c *conn, err error)`:

``` go
// Create new connection from rwc.
func (srv *Server) newConn(rwc net.Conn) (c *conn, err error) {
  c = new(conn)
  c.remoteAddr = rwc.RemoteAddr().String()
  c.server = srv
  c.rwc = rwc
  c.w = rwc
  if debugServerConnections {
    c.rwc = newLoggingConn("server", c.rwc)
  }
  c.sr = liveSwitchReader{r: c.rwc}
  c.lr = io.LimitReader(&c.sr, noLimit).(*io.LimitedReader)
  br := newBufioReader(c.lr)
  bw := newBufioWriterSize(checkConnErrorWriter{c}, 4<<10)
  c.buf = bufio.NewReadWriter(br, bw)
  return c, nil
}
```

`func (c *conn) setState(nc net.Conn, state ConnState)`:

``` go
func (c *conn) setState(nc net.Conn, state ConnState) {
  if hook := c.server.ConnState; hook != nil {
    hook(nc, state)
  }
}
```

`func (c *conn) serve()` (一大串) 

感謝有很方便的函式庫, 幫我們處理了很多底層的細節阿! 

再來就是要練習與追蹤net函式庫了。

## More 

[net/http lib](http://golang.org/pkg/net/http/)

[Not Another Go/Golang net/http Tutorial](http://soryy.com/blog/2014/not-another-go-net-http-tutorial/)。

