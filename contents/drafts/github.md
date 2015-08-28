# [Git]


----------

## 如何在commit間移動

例如我的master branch:  C1 -> C2 -> C3,  HEAD在C3, 我要移動要C1來建立分支, 如何做

`git checkout`: Checkout a branch or paths to the working tree



## 不要每次都打密碼 

`git config --global credential.helper cache`

section 7-14


## 刪除遠端 branch



## .gitconfig 共用參數撰寫

https://github.com/durdn/cfg/blob/master/.gitconfig


## 使用git merge tool -- 使用vimdiff

哪個好?

顏色標示不同branch block, 

two-way or three-way comparison

vim 相容

也可以用來比較兩個檔案間的差異

[use vimdiff as git mergetool](http://www.rosipov.com/blog/use-vimdiff-as-git-mergetool/): comment也要看

[vimdiff cheat sheet](https://gist.github.com/mattratleph/4026987)



## 使用 issue tracker system

https://github.com/g0v/dev/wiki/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8-Issue-Tracker-%E5%9B%9E%E5%A0%B1%E5%95%8F%E9%A1%8C%E3%80%81%E6%8F%90%E4%BA%A4%E5%BB%BA%E8%AD%B0

[github-guide-masterubg issues](https://guides.github.com/features/issues/)


## Searching for Content 

`git grep regexp` : Search working tree for text matching reqular expression regexp.


## Git Alias

[One weird trick for powerful Git aliases](http://blogs.atlassian.com/2014/10/advanced-git-aliases/)


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
