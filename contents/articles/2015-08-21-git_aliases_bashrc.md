# [Git] g< alias > = .gitconfig + .bashrc

主要參考: [The Ultimate Git Alias Setup](https://gist.github.com/mwhite/6887990), 

每天都要用到的git command, 若乖乖打字每天都要打好多重複的指令, 當然有效的利用alias可以幫我們節省很多時間, 整理如下。

## .gitconfig

我的`.gitconfig`部份: 

```
[alias]
  a = add
  ap = add -p

  c = commit --verbose
  ca = commit -a --verbose
  cm = commit -m
  cam = commit -a -m
  m = commit --amend --verbose

  d = diff
  dst = diff --stat
  ds = diff --staged
  

  s = status -s
  ss = status 

  co = checkout
  cob = checkout -b
  
  br = branch
  
  p = push -u origin --all
```

在`.gitconfig`新增alias有幾個好處, 第一可以不用打那麼多字, 例如`git status`只要打`git s`就可,
並且支援git command auto completion, 例如輸入`git s`按下`tab`鍵, 就會顯示`s`開頭的參數。

## g &lt;alias&gt;

另外一種加入Git Alias方法就是加入shell等級的aliasses,  例如在`.bashrc`中: 

``` 
# .bashrc
alias gs="git status -s"
```

這樣重新載入`.bashrc`後, 直接輸入`gs`就執行`git status -s`。

壞處就是無法和Git本身的alias system整合, 並且無法使用git autocompletion。另外`~/.gitconfig`有把整個git aliases獨立出來管理的優點。

那另外一個想法就是那alias我用`.gitconfig`管理, 我只要在shell層級設定:

```
alias g="git"
```

這樣我就可以輸入像是`g s`,或是`g st`這樣, 但是這樣也無法使用git command completion, 需要改寫成這樣: 

```
alias g='git'
source /usr/share/bash-completion/completions/git
complete -o default -o nospace -F _git g
```

就可以使用`g <alias>`的快速指令。 

## g&lt;alias&gt;

不過老是要在`g`跟`<alias>`間多個空白, 總是覺得用起來不夠爽快, 

在`~/.bashrc`加入以下: 

``` 
# g<alias>
source /usr/share/bash-completion/completions/git

function_exists() {
    declare -f -F $1 > /dev/null
    return $?
}

for al in `__git_aliases`; do
    alias g$al="git $al"

    complete_func=_git_$(__git_aliased_command $al)
    function_exists $complete_fnc && __git_complete g$al $complete_func
done
```

這樣就可以使用`gs`(相當於`git status`)的alias指令, 並且只要我們在`.gitconfig`新增新的alias, 就可以自動使用新的`g<alias>`, 方便多了!


## More 

[The Ultimate Git Alias Setup](https://gist.github.com/mwhite/6887990)

[Must Have Git Aliases: Advanced Examples](http://durdn.com/blog/2012/11/22/must-have-git-aliases-advanced-examples/)

[Super Useful Need To Know Git Commands](http://zackperdue.com/tutorials/super-useful-need-to-know-git-commands)
