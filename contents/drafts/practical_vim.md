# [Vim] Practical Vim 

## Ch2 normal mode

`u` --> undo , undo我們從insert mode回到normal mode的時候的部份, 所以我們可以利用`ESC`來決定我們每次要undo的部份

`A` ? 

*Vim is optimized for repetition.*


察看用法, 例如--> `:h aw`


`aw` --> a word 

`daw` --> delete a word

`iw` --> inner word

`ap` --> a paragraph (以一個空行為界)

`ip` --> inner paragraph

`dap`,`dip`

`dl` --> delete a single character



*所有動作都用能用dot command才能發揮最大效益*


`:h count` 

### Ctrl-a , Ctrl-x

`ctrl-a` --> add [count] to the number

`ctrl-x` --> substact [count] to the number 

``` 
this is 5
```

如果游標在5上, `10ctrl-a`那5就會變成15

如果游標不在5上, `10ctrl-a`就會把5變成15, 並且游標會跳到5

寫CSS很方便! 

``` css
.blog { background-position: 0px 0px }
```

游標在`.`, 執行`180ctrl-x`就會變成: 

``` css
.blog { background-position: -180px 0px }
```

## d2w, 2dw, dw..

`d2w` --> delete 2 words

`2dw` --> delete a word two times 

`dw..` --> delete a word and repeat

像`d7w`你會很難確認你是否真正要delete 7個字, 不如用`dw.......`, 這樣就可用`u`回復

**use a count when it matters**

```
I have a couple of questions.
```

要改成

``` 
I have some more questions.
```

用`c3wsome more` 還是比較適合

## gu, gU

`gUaw` 一個字改成全部大寫

## Operator + Motion = Action 




