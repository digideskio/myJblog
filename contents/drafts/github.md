# [Git][Github] Viewing the Commit History

## Git log

`git log --stat`列出多少檔案被修改,以及其被修改的行數紀錄:

![git stat](http://imgur.com/24CeVYJl.png)

`git log -p -2` shows the difference introduced in each commit, and limits the output to only the last two entries.

![git log -p](http://imgur.com/LxrYAzBl.png)

`git log --oneline --decorate --graph`, 用來取代像是圖形介面如gitk的好方法!:  

![log decorate](http://imgur.com/dTCPXRnl.png)

`git log --graph`秀出branch和merge history:

```
$ git log --pretty=format:"%h %s" --graph
* 2d3acf9 ignore errors from SIGCHLD on trap
* *  5e3ee11 Merge branch 'master' of git://github.com/dustin/grit
* |\
* | * 420eac9 Added a method for getting the current branch.
* * | 30e367c timeout code and tests
* * | 5a09431 add timeout protection to grit
* * | e1193f8 support for heads with slashes in them
* |/
* * d6016bc require time for xmlschema
* *  11d191e Merge branch 'defunkt' into local
```

### --pretty

`git log --pretty=oneline`

`git log --pretty=format:`

[pretty format 參考](http://git-scm.com/docs/pretty-formats)



### filter log

[Filtering the Commit History](https://www.atlassian.com/git/tutorials/git-log/filtering-the-commit-history)

By date: `git log --after="2015-08-06" --before="2015-08-17"`

By message: `git log --grep="JRA-224:"`, 加`-i` 忽略大小寫

By file: 我只對某些特定檔案有興趣 `git log foo.py bar.py`, 其他參數要加在檔案路徑之前, 例如`git log --stat -2 package.json server.js`

By Content: 例如找說`Hello World`在什麼時候加入到哪個檔案的, 可用`git log -S"Hello World"`, `git log -G`為regex


## Searching for Content 

`git grep regexp` : Search working tree for text matching reqular expression regexp.


## Git Alias

[Pro Git- Git in Other Environments - Git in Bash](https://git-scm.com/book/en/v2/Git-in-Other-Environments-Git-in-Bash)

[The Ultimate Git Alias Setup](https://gist.github.com/mwhite/6887990)

[One weird trick for powerful Git aliases](http://blogs.atlassian.com/2014/10/advanced-git-aliases/)

[Pro Git - Git Aliaes](https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases)

Git Alias最簡單的方法是在`.bashrc`新增alias, 例如: 

``` 
# .bashrc
alias s="git status -s"
```

壞處就是無法和Git本身的alias system整合, 並且無法使用git autocompletion.

直接編輯`~/.gitconfig`, 加入基本指令:

``` 
[alias]
  s = status
  st = status -s
  br = branch
  ci = commit
  co = checkout
```


`bashrc`使用git completion: 

```
alias g='git'
source /usr/share/bash-completion/completions/git
complete -o default -o nospace -F _git g
```


### git log alias

`git ls`, `git ll`



## Vim git tool

## 跳到特定commit

## 察看特定commit的特定檔案

### 復原某特定commit的特定檔案? 

## 更改git branch 名字


## 更正git commit message 

http://stackoverflow.com/questions/179123/edit-an-incorrect-commit-message-in-git

`git commit --amend`, `git commit --amend -m "New commit message"`


## git push origin不用輸入帳號密碼

[github設定SSH keys](https://help.github.com/articles/generating-ssh-keys/)

將origin由原來的`https`改成`ssh`

![ssh](http://imgur.com/DmudyO7l.png)

```
$ git remote -v 
```

http://stackoverflow.com/questions/6565357/git-push-requires-username-and-password


## pull request 怎麼用

## 怎麼在別人的repository 發問

## issue是什麼


## More 
[Must Have Git Aliases: Advanced Examples](http://durdn.com/blog/2012/11/22/must-have-git-aliases-advanced-examples/)

[Super Useful Need To Know Git Commands](http://zackperdue.com/tutorials/super-useful-need-to-know-git-commands)
