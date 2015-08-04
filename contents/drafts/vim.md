# [Vim]

## CSS syntax errors via CSSlint in VIM

[source](https://michalzuber.wordpress.com/2014/12/03/css-syntax-errors-via-csslint-in-vim/)

``` 
$ sudo npm install -g csslint
```

`.vimrc`加入:

``` 
let g:syntastic_csslint_args="--ignore=outline-none"
```




## 單引號改雙引號

[使用surrend](http://www.vim.org/scripts/script.php?script_id=1697) 插件

`cs  + 單引號+雙引號`將單引號改成雙引號

`cs'<q>`會把 'Hello World' 改成 <q>Hello World</q>

`ds'`會把 'Hello World'刪掉引好變成  Hello World


## buffer switching

[easy buffer switching](http://vim.wikia.com/wiki/Easier_buffer_switching)

`:ls` 

`:b#` 跳到所選號碼檔案去

`:db#` 刪除某個buffer

`:db` 關掉目前所在的buffer

將目前的buffer變成split一個新的切割視窗: `sb#`, 如果要切成垂直split, 那前面要加`vert`, 變成使用 `:vert sb#`


## 執行上一個command 

先`:`然後使用`上下箭頭`找執行過的指令。

或是直接`@:`就可執行上一個指令。

## tagbar

```
$ sudo apt-get install exuberant-ctags
```

使用vundle: https://github.com/majutsushi/tagbar

`.vimrc`加入快速鍵(可以任意): 

``` vim
nmap <F8> :TagbarToggle<CR>
```

按F8救出tage list


