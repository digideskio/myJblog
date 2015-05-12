# jade static blog website generator

簡單的static blog website產生器。

## 使用方式

先clone整個repo回去, 然後`npm install`相關的函式庫。在該資料夾新增`build`資料夾

將寫好的markdown檔案放在`contents/articles`下, 執行`npm run build`就可以將markdown檔案編譯成html, 編好的內容都在`./build`資料夾。

## markdown檔案格式

markdown檔案的命名格式像是`2015-05-12-gen_file.md`, 第1行必須為標題1並且不能空白, 像是`# 我是這篇文章的標題`。

## 資料結構

```
.
├── build
├── contents
│   ├── articles
│   └── scss
├── gen.js
├── package.json
├── README.md
└── templates
    ├── Html.jade
    └── Index.jade
```

- `build`: 編譯好的html. css檔案放這
- `contents`: 來源檔案, markdown file, scss file
- `templates`: jade templates
- `gen.js`用來編譯所有來源檔案到build資料夾

