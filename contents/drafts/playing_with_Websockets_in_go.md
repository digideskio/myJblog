# Playing with websockets in Go

http://www.jonathan-petitcolas.com/2015/01/27/playing-with-websockets-in-go.html

此篇也可當作 Golang + Docker 的範例! 



先建立中央架構: `Hub`, 用來收所有訊息, 然後broadcast出去 給連線上來的`Client`

------------

## Gorilla/websocket

http://www.gorillatoolkit.org/pkg/websocket

以及: 

https://github.com/gorilla/websocket/blob/master/examples/chat/main.go



