# [React-native] 

## 使用 flow 做static type checker

http://flowtype.org/

## ListView

`onEndReached`: callbacks on reaching the end of the avaiable data

`onChangeVisibleRows`: on the set of rows that are visible in the device viewport change

performance optimization多個選項, 

There are a few performance operations designed to make ListView scroll smoothly while dynamically loading potentially very large (or conceptually infinite) data sets:

  - *only re-render changed rows*: 使用`rowHasChanged` function, 參考 **ListViewDataSource**
  - *Rate-limited row rendering*: By default, only one row is rendered per event-loop (customizable with the `pageSize` prop). This breaks up the work into smaller chunks to reduce the chance of dropping frames while rendering rows.


## for android

http://blog.rudolph-miller.com/2015/09/15/setup-react-native-for-android/

Configure HAXM: 

```
open /usr/local/Cellar/android-sdk/24.3.4/extras/intel/Hardware_Accelerated_Execution_Manager/IntelHAXM_1.1.4.dmg
```

確認有無安裝: 

```
kextstat | grep intel
```

確認裡面有`com.intel.kext.intelhaxm`

## Develping Android App 

`react-native init MyProject`

`android avd`

`react-native run-android`

in the Android emulator press `Fn+F2` on OSX to reload App.


## socket.io 

gist: https://gist.github.com/xiujunma/cf0c0c47d5022630b9bf

http://stackoverflow.com/questions/29408492/is-it-possible-to-combine-react-native-with-socket-io

[reactjs+socketio+es6](http://danialk.github.io/blog/2013/06/16/reactjs-and-socket-dot-io-chat-application/)

[Using the ES6 transpiler Babel on Node.js](http://www.2ality.com/2015/03/babel-on-node.html)



## Tools / Todo

react-native eslint  / beautify

react-native code應該哪些要放到github, 參考別人放哪些

oh-my-zsh aliases: https://github.com/robbyrussell/oh-my-zsh/wiki/Cheatsheet

emmet ctrl-y 修改： https://www.zfanw.com/blog/zencoding-vim-tutorial-chinese.html
