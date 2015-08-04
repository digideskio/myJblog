# [Golang] Blueprints 筆記

## Ch1 

compile template once ! use `sync.Once` type, keep the reference to the compiled template.


``` go
package main
import (
  "html/template"
  "log"
  "net/http"
  "path/filepath"
  "sync"
)
type templateHandler struct {
  once     sync.Once
  filename string 
  templ    *template.Template
}
func (t *templateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  t.once.Do(func() {
    t.templ =
      template.Must(template.ParseFiles(filepath.Join("templates", t.filename)))
    t.templ.Execute(w, nil)
  })
}
func main() {
  http.Handle("/", &templateHandler{filename: "chat.html"})
  if err := http.ListenAndServe(":8080", nil); err != nil {
    log.Fatal("ListenAndServe:", err)
  }
} 
```

### sync.Once

### http.Handle

### http.Handler

### filepath.Join


## Ch1 - Modeling a chat room and clients on the server 

`room` type --> 負責管理client connections, routing message in and out


建議不要重複造輪子, 如果要建立一個新的package, 先找看看有沒有現成的, 若不滿足, 考慮基於這個project來增加features.

### Gorilla 的 websocket package

有興趣, 建議在看其source code看怎麼寫的: https://github.com/gorilla/websocket

channels --> in-memory thread-safe message queue where senders pass data and receivers read data in a non-blocking , thread-safe way.

``` go
type room struct {                                                                              
  // forward is a channel that holds incoming messages                                          
  // that should be forward to the other clients.                                               
  forward chan []byte                                                                           
  //join is a channel for clients wishing to join the room.                                     
  join chan *client                                                                             
  //leace is a channel for clients whishing to leave the room.                                  
  leave chan *client                                                                            
  //clients holds all current clients in this room                                              
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
      //forward message to all clients                                                          
      for client := range r.clients {                                                           
        select {                                                                                
        case client.send <- msg:                                                                
          //send the message                                                                    
        default:                                                                                
          //failed to send                                                                      
          delete(r.clients, client)                                                             
          close(client.send)                                                                    
        }                                                                                       
      }                                                                                         
    }                                                                                           
  }                                                                                             
}     
```

`join`和`leave`讓我們可以安全的從`clients` map新增/移除 clients

因為如果直接存取map, 有可能會兩個Go routines會並行(concurrently)來修改map, 這樣會導致currupt memory 或是 an unpredictable state.


`select`一次只會run一次 one block of case code at a time. 確保`r.clients` map 在同時間只有一個修改動作






