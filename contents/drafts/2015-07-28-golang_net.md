# [Golang] package研究 --  net 

## net 

``` go 
import "net"
``` 

http://golang.org/pkg/net/

`net` package 提供一個network I/O 的 portable interface, 包括 TCP/IP, UDP, domain name resolution, Unix domain sockets。

大多數client只用到基本介面, 像是 `Dial`, `Listen`, `Accept` function, 以及相關的 `Conn`, `Listener` interfaces。

`crypto/tls`使用相同interfaces以及類似的`Dial`, `Listen` functions。

利用`Dial`function 來連線到server: 

``` go 

```

利用 `Listen` function 來建立server

``` go
```



