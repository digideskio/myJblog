# [Go] 使用gvm安裝golang, 並設定vim開發環境

[Go](https://golang.org/)好像很好玩！

感謝有 [Go Version Manager](https://github.com/moovweb/gvm)(gvm)提供了管理Go版本的介面, 讓安裝golang變的簡單。

## 安裝GO

安裝gvm之前, 先檢查我使用的Ubuntu 14.04有哪些需要前置安裝的套件: 

``` bash 
sudo apt-get install curl git mercurial make binutils bison gcc build-essential
```

再來安裝gvm:

```
bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)
```

察看一下 `gvm` 有哪些命令列參數可用: 

``` bash
$ gvm
Usage: gvm [command]

Description:
  GVM is the Go Version Manager

Commands:
  version    - print the gvm version number
  get        - gets the latest code (for debugging)
  use        - select a go version to use
  diff       - view changes to Go root
  implode    - completely remove gvm
  install    - install go versions
  uninstall  - uninstall go versions
  cross      - install go cross compilers
  linkthis   - link this directory into GOPATH
  list       - list installed go versions
  listall    - list available versions
  alias      - manage go version aliases
  pkgset     - manage go packages sets
  pkgenv     - edit the environment for a package set
```

檢查一下所安裝的gvm版本:

``` bash
$ gvm version
Go Version Manager v1.0.22 installed at /home/parks/.gvm
```

看有哪些go版本可以裝: 

``` bash
$ gvm listall

gvm gos (available)
   ...
   go1.3
   go1.3.1
   go1.3.2
   go1.3.3
   go1.3beta1
   go1.3beta2
   go1.3rc1
   go1.3rc2
   go1.4
   go1.4.1
   go1.4.2
   go1.4beta1
   ...
```

安裝最新穩定版1.4.2: 

``` bash
$ gvm install go1.4.2 --default
Downloading Go source...
Installing go1.4.2...
* Compiling...
```

告訴gvm我們要用的go版本是1.4.2, 並確認看看go有沒有安裝成功:

``` bash 
$ gvm use go1.4.2
Now using version go1.4.2
$ go version
go version go1.4.2 linux/amd64
```

重新讀取`~/.bashrc` 或是重新啟動終端機。

## 設定 $GOPATH

`GOPATH`環境變數是用來指定我們的工作區(workspace)包含相關函式庫的所在位置。

利用gvm所提供的`pkgset`來設定 GOPATH, 例如我要新增一個pkgset叫作work: 

``` bash
$ echo $GOPATH
/home/parks/.gvm/pkgsets/go1.4.2/global
$ gvm pkgset use work
Now using version go1.4.2@work
$ echo $GOPATH
/home/parks/.gvm/pkgsets/go1.4.2/work:/home/parks/.gvm/pkgsets/go1.4.2/global
```

這樣我們就使用`work`所在位置當作我們預設的workspace了。

不過如果不想要用`$HOME/.gvm/pkgsets/go1.4.2/work`當作開發目錄的話, 我們可以手動來加上workspace路徑, 例如我想用`~/src/go`: 

``` bash
$ mkdir -p ~/src/go/{bin,pkg,src}
```

使用`gvm pkgenv`來修改環境變數: 

``` bash
$ gvm pkgenv work
```

這時候會打開預設編輯器秀出所有路徑, 只要修改 $GOPATH 和 $PATH加入新的workspace路徑(`~/src.go`), 和workspace的`bin`路徑就成: 

``` bash
...
export gvm_pkgset_name="work"
export GOPATH; GOPATH="/home/parks/.gvm/pkgsets/go1.4.2/work:$GOPATH:$HOME/src/go"
export PATH; PATH="$HOME/src/go/bin:/home/parks/.gvm/pkgsets/go1.4.2/work/bin:$PATH"
...
```

## 設定Vim開發環境 -- 使用 vim-go
是
go安裝好了,把編輯環境弄一下也是很正常的事。 ]謝vim下有澎湃的[vim-go](https://github.com/fatih/vim-go)可用, vim-go把所有開發go會用到的工具都整合了, 像是語法高亮, go command的快速鍵, auto completion, go的文件查閱, 語法檢查... 

安裝推荐使用 [Vundle](https://github.com/gmarik/vundle): 

``` bash
Plugin 'fatih/vim-go'
```

記得最後在vim執行: 

```
:GoInstallBinaries
```

這樣就會幫我們把vim-go所用的相關lib通通裝好

如果要自動完成,要安裝[YouCompleteMe](https://github.com/Valloric/YouCompleteMe), 如果要秀source code tag infomation, 要安裝[tagbar](https://github.com/majutsushi/tagbar)

如果要使用godoc查找資料, 要先安裝godoc tool, 就可以使用像是`:GoDoc fmt println`來查看文件, 
或是直接在所使用function上, 執行`:GoDoc` 就會列出該函式說明, 或是執行`:GoDef`查看該函式source code。

執行 `:GoPath` 就會秀出$GOPATH。

執行 `:GoRun` 就相當於執行`go run 你的go程式.go`。

![Hello](http://i.imgur.com/T2FL1Lr.jpg) 

**Hello! Go World!**

## more

[Go wiki](https://github.com/golang/go/wiki): Go語言相關資源蒐集

[gvm with golang](http://www.ascent.io/blog/2014/03/11/gvm-with-golang/)

[managing a go environment in ubuntu](https://larry-price.com/blog/2015/01/18/managing-a-go-environment-in-ubuntu)

[building a rest service with golang -1](http://stevenwhite.com/building-a-rest-service-with-golang-1/) : gvm & go workspace設定

