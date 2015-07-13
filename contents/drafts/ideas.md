# [IDEAS]

## Html簡報的static website generator

### 想法
用markdown寫簡報

先完成: 
slide.md --> dist folder  

dist --> index.html, main.css, main.js


slide md format: 

``` markdown
# 1 

## page1 title or anything  最多只能用標題2 

# 2

## page 2

# 3

## page3 
```

產生slide.html 和 silde.pdf不同css,js 

**先做gen.go產生結果dist, 用web server開啟, 之後再來改善**

### 做法



### 參考

[blackfriday command line tool](https://github.com/russross/blackfriday-tool)

[blackfriday + template on the fly example](http://stackoverflow.com/questions/23198739/how-can-i-render-markdown-to-html-with-blackfriday-in-go)

[remark](https://github.com/gnab/remark)

[swipe](https://www.swipe.to/markdown/)

[How to Create a SlideShow Presentation From markdown Notes](http://computers.tutsplus.com/tutorials/how-to-create-a-slideshow-presentation-from-markdown-notes--cms-23062) : ruby的

## Todo command line 


