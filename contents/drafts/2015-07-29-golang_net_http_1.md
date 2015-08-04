# [Golang] net / http

翻譯與整理自[Not Another Go/Golang net/http Tutorial](http://soryy.com/blog/2014/not-another-go-net-http-tutorial/)。

## Example 1

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

## http.ResponseWriter

handler function要傳入兩個參數, 其中一個是 [http.ResponseWriter](http://golang.org/pkg/net/http/#ResponseWriter):

``` go
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

從source code來看, `http.ResponseWriter`是一個interface type, 其定義了三種行為(actions): 

### Header() Header

傳回一個header map給`WriteHeader`使用:

``` go
type Header map[string][]string
```

### Write([]byte) (int, error)

寫入資料(接收 `[]byte` type)

### WriteHeader(int)

傳回一個包含status code的response header。

## 改寫 handler function 

理解了`http.ResponseWriter`後, 可以延伸改寫`handler` function, 例如JSON服務: 

``` go
type Item struct {
  Name string
}

handler(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json; charset=utf-8") 
  myItem := Item{"item1"}
  a, _ := json.Marshal(myItems)
  w.Write(a)
}
```

我們設定一個HTTP header, 把一個string slice轉成JSON, 然後寫入資料(傳回資料給client)。得到結果為: 

```
$ curl localhost:8080
{"Name":"item1"}
```

## http.Request

[http.Request](http://golang.org/pkg/net/http/#Request)就是一個表示initail request的struct type, 註解直接看source, 簡寫如下: 

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

## ServeMux

``` go
http.ListenAndServe(":8080", nil)
```

`http.HandleFunc`: 

``` go
// HandleFunc registers the handler function for the given pattern
// in the DefaultServeMux.
// The documentation for ServeMux explains how patterns are matched.
func HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
  DefaultServeMux.HandleFunc(pattern, handler)
}
```

[ServerMux](http://godoc.org/net/http#ServeMux)定義: 

> ServeMux is an HTTP request multiplexer. It matches the URL of each incoming request against a list of registered patterns and calls the handler for the pattern that most closely matches the URL.

Multiplexer [英文解說](https://en.wikipedia.org/wiki/Multiplexing) 和 [中文解說](https://zh.wikipedia.org/wiki/%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8)


``` go
// serverHandler delegates to either the server's Handler or
// DefaultServeMux and also handles "OPTIONS *" requests.
type serverHandler struct {
  srv *Server
}

func (sh serverHandler) ServeHTTP(rw ResponseWriter, req *Request) {
  handler := sh.srv.Handler
  if handler == nil {
    handler = DefaultServeMux
  }
  if req.RequestURI == "*" && req.Method == "OPTIONS" {
    handler = globalOptionsHandler{}
  }
  handler.ServeHTTP(rw, req)
}
```
所以`sh.srv.Handler`為`nil`就指定 `DefaultServeMux`當作預設的handler

``` go
// NewServeMux allocates and returns a new ServeMux.
func NewServeMux() *ServeMux { return &ServeMux{m: make(map[string]muxEntry)} }

// DefaultServeMux is the default ServeMux used by Serve.
var DefaultServeMux = NewServeMux()
```

ServeMux struct: 

``` go
// ServeMux also takes care of sanitizing the URL request path,
// redirecting any request containing . or .. elements to an
// equivalent .- and ..-free URL.
type ServeMux struct {
  mu    sync.RWMutex
  m     map[string]muxEntry
  hosts bool // whether any patterns contain hostnames
}
```



## ListenAndServe

``` go
// ListenAndServe listens on the TCP network address addr
// and then calls Serve with handler to handle requests
// on incoming connections.  Handler is typically nil,
// in which case the DefaultServeMux is used.
func ListenAndServe(addr string, handler Handler) error {
  server := &Server{Addr: addr, Handler: handler}
  return server.ListenAndServe()
}
```

取得一個新的`Server` struct, 然後呼叫其`ListenandServe()`: 

``` go
// ListenAndServe listens on the TCP network address srv.Addr and then
// calls Serve to handle requests on incoming connections.  If
// srv.Addr is blank, ":http" is used.
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

`Server.Serve()`:

``` go
// Serve accepts incoming connections on the Listener l, creating a
// new service goroutine for each.  The service goroutines read requests and
// then call srv.Handler to reply to them.
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

private method: `Server.newConn()`: 

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


## More 

[HTTP Response Snippets for Go](http://www.alexedwards.net/blog/golang-response-snippets#json)
