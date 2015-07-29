# [Golang] Template(一)

[http/template/](http://golang.org/pkg/html/template/) package實作用來生成HTML的data-driven templates, 並且可以防止[code injection](https://zh.wikipedia.org/wiki/%E4%BB%A3%E7%A2%BC%E6%B3%A8%E5%85%A5)。

`html/template`提供跟 [text/template](http://golang.org/pkg/text/template/) 相同介面, 不管是不是輸出HTML建議都用這個`html/template` package。

以下內容部份整理與翻譯自官網http/template, 以及 [Go Template Primer](http://gohugo.io/templates/go-templates/)。


## 使用樣板

例如, 要發給參加婚宴賓客的回覆([出處](http://golang.org/pkg/text/template/#example_Template)):

``` go 
package main
import (
  "html/template"
  "os"
)
const letter = `
Dear {{.Name}},
{{if .Attended}}
It was a pleasure to see you at the wedding.{{else}}
It is a shame you couldn't make it to the wedding.{{end}}
{{with .Gift}}
Thank you for the lovely {{.}}.
{{end}}
Best wishes,
Josie
`

//Prepare some data to insert into template
type Recipient struct {
  Name, Gift string
  Attended   bool
}

func main() {
  recipients := []Recipient{
    {"Aunt Mildred", "bone china tea set", true},
    {"Uncle John", "moleskin pants", false},
    {"Cousin Rodney", "", false},
  }
  //Create a new template and parse the letter into it.
  t := template.Must(template.New("letter").Parse(letter))
  //Execute the template for each recipient
  for _, r := range recipients {
    err := t.Execute(os.Stdout, r)
    if err != nil {
      panic(err)
    } 
  }
}
```

輸出結果: 

``` 
Dear Aunt Mildred,

It was a pleasure to see you at the wedding.
Thank you for the lovely bone china tea set.

Best wishes,
Josie

Dear Uncle John,

It is a shame you couldn't make it to the wedding.
Thank you for the lovely moleskin pants.

Best wishes,
Josie

Dear Cousin Rodney,

It is a shame you couldn't make it to the wedding.

Best wishes,
Josie
```

上述例子步驟分述如下。

### 產生樣板字串

用來生成樣板用的: 

``` go
const letter = `
Dear {{.Name}},
{{if .Attended}}
It was a pleasure to see you at the wedding.{{else}}
It is a shame you couldn't make it to the wedding.{{end}}
{{with .Gift}}
Thank you for the lovely {{.}}.
{{end}}
Best wishes,
Josie
`
```

有用過[樣板引擎](https://en.wikipedia.org/wiki/Comparison_of_web_template_engines)的朋友應該都會很快就能適應([語法參考](http://golang.org/pkg/text/template/#pkg-overview))

變數和函式都用`{{}}`。

注意使用`Actions`像是`{{if}}`等述句單獨放一行的話,就會獨占一行空間。

### 要塞入樣板的資料結構(struct)

Go的樣板只接受struct資料餵入: 

``` go
type Recipient struct {
  Name, Gift string
  Attended   bool
}
```

### 準備我們要塞入的資料

``` go
recipients := []Recipient{
  {"Aunt Mildred", "bone china tea set", true},
  {"Uncle John", "moleskin pants", false},
  {"Cousin Rodney", "", false},
}
```

### 產生樣板

利用樣板字串產生一個樣板,並且幫這個樣板取名字

``` go
t := template.Must(template.New("letter").Parse(letter))
```

如果樣板字串是來自於外部檔案, 那麼就利用`template.ParseFiles()`:

``` go
t := template.Must(template.ParseFiles("tmpl/Letter.html"))
```

### 套用樣板

將準備好的資料套用樣板, 輸出最後結果

``` go
for _, r := range recipients {
  err := t.Execute(os.Stdout, r)
  if err != nil {
    panic(err)
  } 
}
```

## 樣板語法 -- iteration 

跟Go一樣, 用超多`range`來遍歷各個資料結構像是map, array或是slice, 

using context: 

``` go
{{ range array }}
  {{ . }}
{{ end }}
```

或是宣告變數名稱: 

``` go 
{{range $element := array}}
  {{ $element }}
{{ end }}
```

多宣告index: 

``` go
{{range $index, $element := array}}
  {{ $index }}
  {{ $element }}
{{ end }}
```

## More 

[go template excute template include html](http://stackoverflow.com/questions/18175630/go-template-executetemplate-include-html)

[Go Template Primer](http://gohugo.io/templates/go-templates/)
