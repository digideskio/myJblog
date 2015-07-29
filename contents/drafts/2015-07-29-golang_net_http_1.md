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

## More 

[HTTP Response Snippets for Go](http://www.alexedwards.net/blog/golang-response-snippets#json)
