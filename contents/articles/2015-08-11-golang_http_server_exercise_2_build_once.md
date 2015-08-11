# [Golang] 利用 net/http 寫Web Server (二) -- template --> build once


以下例子來自於: [Go Programming Blueprints - Solving Development Challenges with Golang](http://www.amazon.com/Go-Programming-Blueprints-Development-Challenges/dp/1783988029)。


``` go
package main
import (
  "html/template"
  "log"
  "net/http"
  "path/filepath"
  "sync"
)
type templateHandler struct {
  once     sync.Once
  filename string 
  templ    *template.Template
}
func (t *templateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  t.once.Do(func() {
    t.templ =
      template.Must(template.ParseFiles(filepath.Join("templates", t.filename)))
    t.templ.Execute(w, nil)
  })
}
func main() {
  http.Handle("/", &templateHandler{filename: "chat.html"})
  if err := http.ListenAndServe(":8080", nil); err != nil {
    log.Fatal("ListenAndServe:", err)
  }
} 
```

編譯一個樣板要發生在該樣板被使用之前, 並且應該只被編譯一次。

`templateHandler` struct 用來載入, 編譯 以及傳送我們的template: 取得`filename` string ,使用`sync.Once` type將樣板編譯一次, 保留指到編好樣板的reference, 然後回應(response)給HTTP request。

`templ` 表示一個單一的template

把編譯template的工作放在`ServeHTTP`有好處, 其中之一是我們不會浪費時間編譯, 除非他真的被用到


利用以下程式碼來使用我們自定義的handler: 

``` go
http.Handle("/", &templateHandler{filename: "chat.html"})
```

因為`templateHandler` struct藉由實作`ServeHTTP` method, 成為一個有效的`http.Handler` type, 因此我們可以直接pass `templateHanlder`到`http.Handle` function中, 讓其可以處理符合特定pattern的request。

這裡我們利用 **&** (**address of** operator)

