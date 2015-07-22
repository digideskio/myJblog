# [Go] Build Web service in Go

[video](https://www.youtube.com/watch?v=MeOK1UzGHYw)

F
[github code](https://github.com/zorkian/lca2015)

[RPC(remote procedure call)定義](http://searchsoa.techtarget.com/definition/Remote-Procedure-Call)

[proxy server定義](https://en.wikipedia.org/wiki/Proxy_server)

Why a proxy ? 用proxy來當Go練習的原因 

everything can be solved with a proxy. 

Great for gathering statistics or changing behavior of opaque systems. (think database!)

Good combination example of client/server behavior, with good illustration of Go tenets.

## Basic Design

Accept a connection 

Read some requests

Proxy to Backend

Write response to client


## Go net/http library

the standard library has great support for network servers. 

full suite of HTTP code to make a bsic proxy extremely trivial

**make heavy use of bufio**


## bufio 

Many small reads/writes is very inefficient.

if you ever see high system CPU% , you might to be inefficient doing I/O

use bufio for performance: read like normal, or write(and **remember to flush!**)


## http lib 

### read a request 

``` go
func ReadRequest(b *bufio.Reader) (req *Request, err error)
```

就用到 bufio Reader 


建立完一個for loop listen request後, 

再來建立一個 bufio Reader

利用part_1  final建立的, 一次只能一個customeer, serialized everything, 慢 --> 

需要 **do two things at once** --> async, parallel, concurrent <-- Go的中心思想

in essence, write everything to be blocking.

you spin off many blocking operations into concurrently running goroutines. 

The runtime is responsible for scheduling in new goroutines when you block.

## Proxy concurrency 

logically, each talking to the proxy is going to be operating seprately and independently.

seems like a good candidate for having one goroutine per connection

**Go is happy with 100000+ goroutines!**





