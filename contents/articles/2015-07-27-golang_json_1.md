# [Golang] JSON (一)

翻譯與筆記[json and go](http://blog.golang.org/json-and-go)。

``` go
import "encoding/json"
``` 

## encoding 

使用`Marshal` function: 

``` go 
func Marshal(v interface{}) ([]byte, error)
```

例如: 

``` go
package main                                                                                    
import (                                                                                        
  "encoding/json"                                                                               
)                                                                                               
type Message struct {                                                                           
  Name, Body string                                                                             
  Time       int64                                                                              
}                                                                                               
func main() {                                                                                   
  m := Message{"Alice", "Hello", 1294706395881547000}                                           
  b, err := json.Marshal(m)                                                                     
  if err != nil {                                                                               
    panic(err)                                                                                  
  }                                                                                             
}
```

b 為`[]byte`:  

```
[]byte(`{"Name":"Alice","Body":"Hello","Time":1294706395881547000}`)
```

只有可以被表示為有效的JSON的資料結構可以被編碼: 

- JSON object 只支援`string`當作key, 所以要編碼Go的`map`型別的時候, map必須是`map[string]T`才行。
- `Channel`, `complex`, 以及`function` 型別不能被編碼。
- Cyclic data structures are not supported; they will cause Marshal to go into an infinite loop.
- Pointers will be encoded as the values they point to (or 'null' if the pointer is nil).
The json package only accesses the exported fields of struct types (those that begin with an uppercase letter). Therefore only the the exported fields of a struct will be present in the JSON output.

## Decoding

使用`Unmarshal` function: 

``` go
func Unmarshal(data []byte, v interface{}) error
```

先建立一個struct可以來擺放我們解碼後的資料, 像是`var m Message`:


``` go
package main                                                                                    
                                                                                                
import (                                                                                        
  "encoding/json"                                                                               
  "fmt"                                                                                         
)                                                                                               
                                                                                                
type Message struct {                                                                           
  Name, Body string                                                                             
  Time       int64                                                                              
}                                                                                               
                                                                                                
func main() {                                                                                   
  b := []byte(`{"Name":"Alice","Body":"Hello","Time":1294706395881547000}`)                     
  var m Message                                                                                 
                                                                                                
  err := json.Unmarshal(b, &m)                                                                  
  if err != nil {                                                                               
    panic(err)                                                                                  
  }                                                                                             
  fmt.Printf("%+v", m)                                                                          
                                                                                                
}
```

如果`b`包含了正確的JSON格式, 並且符合`m`結構, 結果就會存在`m`裏面: 

``` go
{Name:Alice Body:Hello Time:1294706395881547000}
```

如果`b`的內容不完全符合我們要塞進去的struct格式:

``` go 
b := []byte(`{"Name":"Bob","Food":"Pickle"}`)
```

那麼得到結果為: 

``` go
{Name:Bob Body: Time:0}
```

Go只會塞入符合struct欄位的資料, 像是`Food`就會忽略掉。

如果你只想要**擷取來源JSON的某部份資料**(特別是很大的JSON內容)的時候, 將會很有用。


## 當無法知道來源JSON資料結構的時候? --> interface{}

空的interface `interface{}`可以當作是一般性的container type, 利用`type assertion`來轉成特定的型別: 


``` go
package main                                                                                    
                                                                                                
import (                                                                                        
  "fmt"                                                                                         
  "math"                                                                                        
)                                                                                               
                                                                                                
func main() {                                                                                   
  var i interface{}                                                                             
  i = "a string"                                                                                
  i = 2011                                                                                      
  i = 2.777                                                                                     
                                                                                                
  r := i.(float64)                                                                              
  fmt.Println("the circle's area", math.Pi*r*r)                                                 
} 
```

如果不知道來源JSON轉過來的具體型別, 利用type switch來判斷: 

``` go
switch v := i.(type) {
case int:
    fmt.Println("twice i is", v*2)
case float64:
    fmt.Println("the reciprocal of i is", 1/v)
case string:
    h := len(v) / 2
    fmt.Println("i swapped by halves is", v[h:]+v[:h])
default:
    // i isn't one of the types above
}
```

json packages 使用 `map[string]interface{}`來儲存。


## More

[json and go](http://blog.golang.org/json-and-go)
