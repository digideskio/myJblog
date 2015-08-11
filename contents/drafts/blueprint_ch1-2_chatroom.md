# [Go Programming Blueprints] Ch1-2 modeling a chat room and clients on the server

強力推荐 [Go Programming Blueprints - Solving Development Challenges with Golang](http://www.amazon.com/Go-Programming-Blueprints-Development-Challenges/dp/1783988029), 以下是部份整理與心得。


## 目標: a chat application 

一個chat application為一個web server, 負責兩件事情: 

  1. 服務在客戶端瀏覽器執行的HTML和JavaScript chat clients 
  2. 接收web socket connections來允許客戶端之間通訊。

![web socket](https://www.websocket.org/img/websocket-architecture.jpg)



所有的users(**clients**)在我們的chat application中, 都會被自動放到一個大的public **room**。在room的每個人都可以跟每個人互相聊天

**room** type負責管理**client** connections 和 route(傳遞) messages (in and out)。

**client** type 表示一個連到一個single client的連線。


## modeling the client 

**client** 表示一個single chatting user.

`client.go`: 

``` go
package main
import (
  "github.com/gorilla/websocket"
)                                                                                                                                       
//client represent a single user.
type client struct {
  socket *websocket.Conn
  send   chan []byte //send is a channel on which messages are sent
  room   *room
}
func (c *client) read() {
  for {
    if _, msg, err := c.socket.ReadMessage(); err == nil {
      c.room.forward <- msg
    } else {
      break
    }
  }
  c.socket.Close()
}
func (c *client) write() {
  for msg := range c.send {
    if err := c.socket.WriteMessage(websocket.TextMessage, msg); err != nil {
      break
    }
  }
  c.socket.Close()
} 
```

socket field可以讓我們跟client side(browser)溝通。

`send` field 是一個buffered channel,  把收到的訊息先queue起來, 然後準備經由socket來forward給user的browser

`room` field 用來keep住 a reference to the room (client所正在聊天的room), 這才能讓我們可以把訊息forward給聊天室內的所有使用者


`read` method 可以讓我們的client從socket讀取message, 然後持續的把收到的訊息給`room`type的`forward` channel, 如果遇到錯誤,loop就會中斷,soket就會關閉

`write` method 持續從 `send` channel接收訊息, 然後把他寫入到socket中去

## room 

`room.go`: 

``` go
package main
type room struct {
  //forward is a channel that holds incoming messages,
  //that should be forwarded to the other clients.
  forward chan []byte
} 
```

`forward` channel 是我們用來發送incoming message 給所有其他clients.


## modeling a room 

我們需要一個方法給clients來 join 或是 leave 聊天室, 以便確保 `c.room.forward <- msg` 可以正確的forward給所有的clients.

為了確保我們不會在同個時間存取相同資料, 

明智的方法是使用兩個channels. 一個用來add clients to the room, 一個用來移除。

更新`room.go`: 

``` go
package main
type room struct {
  forward chan []byte
  join chan *client
  leave chan *client
  clients map[*client]bool
} 
```

如果直接存取`clients` map, 有可能兩個並行的Go routies會同時間試著修改這個map, 會導致記憶體錯誤或是不可預期的問題

## concurrency programming using idiomatic Go

Go concurrency 最有強力的工具: `select` 

我們利用 `select` statement 當我們需要同步或是修改共用的記憶體, 或是在我們channels裏面不同的活動(activities)來採取不同的行動(actions).

``` go
type room struct {
  //forward is a channel that holds incoming messages,
  //that should be forwarded to the other clients.
  forward chan []byte
  join    chan *client
  leave   chan *client
  clients map[*client]bool
}
func (r *room) run() {
  for {
    select {
    case client := <-r.join:
      r.clients[client] = true
    case client := <-r.leave:
      delete(r.clients, client)
      close(client.send)
    case msg := <-r.forward:
      for client := range r.clients {
        select {
        case client.send <- msg:
          //send the message
        default:
          //fail to send
          delete(r.clients, client)
          close(client.send)
        }
      }
    }
  }
}
```

select 一次只會執行一個case的程式碼區段, 這樣才能確保我們的`r.clients` map每次都是同步的被修改

**(more)** 使用map+true setting , 相對slice來說, 是一個low memory的儲存reference方式

## turning a room into an HTTP handler

`room.go`最下面加入: 

``` go
const (
  socketBufferSize  = 1024
  messageBufferSize = 256
)
var upgrader = &websocket.Upgrader{
  ReadBufferSize:  socketBufferSize,
  WriteBufferSize: socketBufferSize,
}
func (r *room) ServeHTTP(w http.ResponseWriter, req *http.Request) {
  socket, err := upgrader.Upgrade(w, req, nil)
  if err != nil {
    log.Fatal("ServeHTTP:", err)
    return
  }
  client := &client{
    socket: socket,
    send:   make(chan []byte, messageBufferSize),
    room:   r,
  }
  r.join <- client
  defer func() {
    r.leave <- client
  }()
  go client.write()
  client.read()
} 
```

加入`ServeHTTP` 表示`room`現在也可以當成handler了! 

為了要使用web sockets, 我們必要要將HTTP connection升級, 這裡利用`websocket.Upgrader` type, 只要建立一個就可以resuable。

當一個request經由`ServeHTTP` method進來, 我們呼叫`upgrader.Upgrade` method來取得socket。

再來建立我們的`client`, 然後把client pass給`join` channel到目前的`room`

記得`defer` the leaving operation, 確保user離開, 所以東西被清空

`write` method 被當作Go routine呼叫。`go` 會告訴Go執行這個method在不同的thread或是goroutine。 

Go相對其他程式語言來說,撰寫multithreading的code數量大幅減少

最後, 我們在main thread呼叫`read` method, 這個method將會block住operations(保持連線)

把可能會hardcode的地方宣告成const是個好的習慣, 當const數量愈來愈多, 可以考慮把他獨立成一個檔案, 或是至少把他擺在檔案的最上頭, 方便閱讀與修改

## use helper functions to remove complexity

`room.go`加入 helper function: 

``` go
func newRoom() *room {
  return &room{
    forward: make(chan []byte),
    join:    make(chan *client),
    leave:   make(chan *client),
    clients: make(map[*client]bool),
  }
}
```

這樣我們程式碼的使用者, 只要呼叫`newRoom`就可以建立`room`, 而不用每次都要重新打6行code

## creating and using rooms 

`main.go`


