# [Go] Defer, Panic

## Panic 

一個`panic`表示某些事情非預期的出錯了, 大多數時間我們用在把不應該出錯的正常運作快速的導向失敗, 或是處理我們還沒有很好處理的錯誤。


## Defer

`Defer`用來確認一個function call是否在一個程式執行後被執行。通常被用來作cleanup。就像其他語言的`ensure`以及`finally`


