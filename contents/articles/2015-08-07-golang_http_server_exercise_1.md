# [Golang] 利用 net/http 寫Web Server (一) -- static files + template

## Static file server 

例如我有一包寫好的html/css/js, 叫做`doc`, 資料結構如下: 

``` 
doc
├── css
│   └── main.css
└── index.html
```

`main.go`: 

``` go
package main

import (
	"log"
	"net/http"
)

func main() {
  handler:= http.FileServer(http.Dir("./doc"))
  if err := http.ListenAndServe(":8080", handler); err != nil {
    log.Fatal("ListenAndServe:", err)
	}
}
```

打開`http:localhost:8080`就可以見到 `doc/index.html`的畫面。


## Hello (from template)

```
$ mkdir templates
$ touch temlpates/Hello.html
```

`Hello.html`:

``` html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>Hello (from template)</title>
</head>
<body>
  <h1>Hello!</h1>
</body>
</html>
```

`main.go`:

``` go
package main

import (
	"html/template"
	"log"
	"net/http"
	"path"
)

func handler(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(path.Join("templates", "Hello.html")))
	t.Execute(w, nil)
}

func main() {
	http.HandleFunc("/", handler)

	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
```

`func Must(t *Template, err error) *Template`就是一個helper function用來傳回Template用, 如果有錯就panic錯誤出來, 通常用來初始化template, `func ParseFiles(filenames ...string) (*Template, error)` 建立一個新的Template, 並且從所給的檔案裏面解析樣板。

## Serve static file  with template 

我們把`static`資料夾, 當作是存放static files的根目錄: 

```
$ mkdir -pv static/css static/js 
$ touch static/css/main.cs static/js/main.js
```

`main.css`: 

``` css
body {
  color: #e91e63;
}
```

`main.js`: 

``` js
function hello(){
  alert('Hello again!');
}
```

修改`templates/Hello.html`加入相關 link: 

``` html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>Hello (from template)</title>
  <link rel="stylesheet" href="/static/css/main.css">
  <script src="/static/js/main.js"></script>
</head>
<body>
  <h1>Hello! (from template)</h1>
</body>
</html>
```

打開chrome devtool會告知: 

```
...
Resource interpreted as Stylesheet but transferred with MIME type text/html
```

如果我們沒有指定對應css, js的URL handler, golang的net/http library就會把該路徑的回應都傳回text。Css, JavaScript檔案均為static file, 需要增加file server來處理, 修改`main.go`: 

``` go
package main

import (
	"html/template"
	"log"
	"net/http"
	"path"
)

func handler(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(path.Join("templates", "Hello.html")))
	t.Execute(w, nil)
}

func main() {

	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", handler)

	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
```

就可正確得到預期的結果: 

![go](http://imgur.com/9F6H5A3l.png)

`StripPrefix`會傳回一個移除所給prefix的handler, 例如這裡如果我們的request是`/static/css/main.css`, 那麼`StripPrefix`就會刪掉`/static/`變成`/css/main.css`, 然後將修改過後的request傳給由`http.FileServer()`所傳回來的handler。 

這裡我們的FileServer所指定的`static`為static files的根目錄。那我們要的`/css/main.css`的確在我們的`static`目錄裏面, 這樣就會得到我們要的結果。


## 錯誤處理

在`handler`加上一些錯誤處理, URL pattern只允許"/", method只允許"GET":

``` go
func handler(w http.ResponseWriter, r *http.Request) {
  if r.URL.Path != "/" {
    http.Error(w, "Not found", http.StatusNotFound)
    return
  }
  if r.Method != "GET" {
    http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    return
  }
	t := template.Must(template.ParseFiles(path.Join("templates", "Hello.html")))
	t.Execute(w, nil)
}
```


## More 

[stackoverflow - why do i need to use http stripprefix to access my static files](http://stackoverflow.com/questions/27945310/why-do-i-need-to-use-http-stripprefix-to-access-my-static-files)

[stackoverflow- how to render multipe templates in golang](http://stackoverflow.com/questions/17206467/go-how-to-render-multiple-templates-in-golang)
