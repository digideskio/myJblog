# [Vim]

## run your shell scripts 

`:！ sh aaa.sh %`

## Visual Mode

`V3j`選了4行

`V3j>` Visually mark and then indent 3 lines

`Ctrl + v + 2e`

`Ctrl + v + iw`

`Ctrl + v + ^`. `Ctrl + v + $`

## [markdown] escape html tag 

 < 和 > 可用: 

```
&lt;
&gt;
```

## open file in vertiacally/horizontal split window

`:sp filename` , `:vsp filename`, 或`:vs filename`

## auto-reload vimrc

http://www.bestofvim.com/tip/auto-reload-your-vimrc/


## Vundle  -- uninstall plugin

## USING GIT AND GITHUB TO MANAGE YOUR DOTFILES

http://blog.smalleycreative.com/tutorials/using-git-and-github-to-manage-your-dotfiles/

## base16 theme

http://chriskempson.github.io/base16/

### tomorrow-theme 

可以考慮(或許可以透明背景?) https://github.com/chriskempson/tomorrow-theme

## vim-markdown 

https://github.com/plasticboy/vim-markdown

`gx` : open the link under the cursor

`:Toc`, `:Toch` open a nav table

`]]`,`[[` 跳到下/上個heading

## HTML lint and format

利用 HTML Tidy with HTML5 support + syntastic 

https://github.com/htacg/tidy-html5

https://github.com/scrooloose/syntastic/wiki/HTML:---tidy

```
let g:syntastic_html_tidy_exec = 'tidy5'
```

或直接使用js-beautify command :

https://github.com/beautify-web/js-beautify

使用vim版本wrapper: (**用這!!**) 

https://github.com/maksimr/vim-jsbeautify

`ctrl-f`就會自動format

## javascript autocomplete 

使用 `youcompleteme`和 `tern_for_vim`

https://github.com/marijnh/tern_for_vim

用 vundle安裝後, 注意修改`~/.vim/bundle/tern_for_vim`的`package.json`
將`tern`改成最新版的套件

`npm install` 和 `npm install -g tern`

設定`~/.vim/bundle/tern_for_vim/.tern-project`: 

```
{
  "libs": [
    "browser",
    "ecma5",
    "ecma6",
    "jquery"
  ],
  "plugins": {
    "node": {}
  }
}
```

## Jumping to previously visited locations

http://vim.wikia.com/wiki/Jumping_to_previously_visited_locations

`ctrl+o` jump back to the previous (order) location, 打開vim後, 我們可以利用這個指令跳到我們上次修改的位置

`ctrl+i` jump forward to the next (newer) location

`:jumps` 列出jump list

```
 jump line  col file/text
   4   102    0 somefile.txt
   3    93    0 -invalid-
   2    23    0 the current line 23 is shown here
   1    89   34 the current line 89 is shown here
>  0    22   40 Display the jump list for the current window with:
   1    39    0 the current line 39 is shown here
   2   995    0 anotherfile.txt
   3    53  102 the current line 53 is shown here
```

Ctrl-I to jump to line 39 in the current buffer.

Ctrl-O to jump to line 89 in the current buffer.

4 then Ctrl-O to jump to line 102 in file somefile.txt.

3 then Ctrl-I to jump to line 53 in the current buffer.


## All the right moves 

`ctrl - d` move half page down

`ctrl - u` move half page up




利用`hjkl`才能跟數字組成快速motion, 例如游標往上移動三行 `3k`

## w 和 W,  b和B

``` css
.news { bakcground-position: 180px 0px }
```

假設游標開始在`.`, 

執行`w`會跑到`n`再來跑到`{`再來`b`再來`-`再來`p`再來`:`再來`1`

執行`W`會跑到`{`再來跑到`b`再來跑到`1`

`b`和`B`同理


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


