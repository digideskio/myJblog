# [Golang] 利用 net/http 寫Web server

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
	if err := http.ListenAndServe(":8080", http.FileServer(http.Dir("./doc"))); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
```

打開`http:localhost:8080`就可以見到 `doc/index.html`的畫面。


## basic http server

``` go
package main

import (
	"log"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(`
	<!DOCTYPE html>
	<html lang="zh">
	<head>
		<meta charset="UTF-8">
		<title>Hello</title>
	</head>
	<body>
		<h1>Hello!</h1>
	</body>
	</html>
	`))
}

func main() {
	http.HandleFunc("/", handler)

	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
```

## hello from template

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

調整一下`main.go`:

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

## serve static file  with template 

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

css, js為static file, 需要file server來處理, 修改`main.go`: 

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

## layout template 

我們來把所有頁面會共用的markup獨立成一個layout template, 

例如我們把原來的`templates/Hello.html`與其他頁面共用的部份獨立成`templates/Layout.html`:

``` html
{{ define "layout"}}
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>{{ template "title" }}</title>
  <link rel="stylesheet" href="/static/css/main.css">
  <script src="/static/js/main.js"></script>
</head>
<body>
  {{template "body"}}
</body>
</html>
{{ end }}
```

原來的`templates/Hello.html`: 

``` html
{{define "title"}}Hello (from template){{end}}

{{define "body"}}
<h1>Hello! (from template)</h1>
<button onclick="hello()">show</button>
{{end}}
```

有寫過templates的朋友應該很快就能適應。

修改原來的`main.go`: 

``` go
package main

import (
	"html/template"
	"log"
	"net/http"
	"path"
)

func handler(w http.ResponseWriter, r *http.Request) {
	lp := path.Join("templates", "Layout.html")
	fp := path.Join("templates", "Hello.html")

	templates := template.Must(template.ParseFiles(lp, fp))
	templates.ExecuteTemplate(w, "layout", nil)
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


We've then specified that all the requests not picked up by the static file server should be handled with a new serveTemplate function (if you were wondering, Go matches patterns based on length, with longer patterns take precedence over shorter ones).

In the serveTemplate function, we build paths to the layout file and the template file corresponding with the request. Rather than manual concatenation we use Join, which has the advantage of cleaning the path to help prevent directory traversal attacks.

We then use the ParseFiles function to bundle the requested template and layout into a template set. Finally, we use the ExecuteTemplate function to render a named template in the set, in our case the layout template.

注意使用`t.ExecuteTemplate` function來指定我們要執行的template, 這裡是`layout`。

## Template Caching 

每次request進來的時候都要parse一次template太不經濟了, 我們把樣板們利用`template.Must`先解析好放到global變數去, , 修改`main.go`如下: 

``` go
package main

import (
	"html/template"
	"log"
	"net/http"
	"path"
)

var (
	lp = path.Join("templates", "Layout.html")
	fp = path.Join("templates", "Hello.html")
)

var templates = template.Must(template.ParseFiles(lp, fp))

func handler(w http.ResponseWriter, r *http.Request) {
	templates.ExecuteTemplate(w, "layout", nil)
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

## Template build once 

要有更大的彈性, 實作Handler, 才可額外傳入參數



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
	lp := filepath.Join("templates", "Layout.html")
	t.once.Do(func() {
		t.templ = template.Must(template.ParseFiles(lp, filepath.Join("templates", t.filename)))
	})
	t.templ.ExecuteTemplate(w, "layout", nil)
}

func main() {

	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.Handle("/", &templateHandler{filename: "Hello.html"})
	http.Handle("/haha", &templateHandler{filename: "Haha.html"})

	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
```

## Validation , 404, 500, handling non-existent pages

validation --> 把沒有提供的URL屏除在外, 例如只提供 /edit/, /view/, 利用regexp把不是/edit, /view的顯示http not found 


## MongoDB

## Testing our web server 

## Form 

## More 

[Writing Web Applications](https://golang.org/doc/articles/wiki/)

[Serving Static Sites with Go](http://www.alexedwards.net/blog/serving-static-sites-with-go)
