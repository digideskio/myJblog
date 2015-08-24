# [Git] basics --  Woorking with Remotes

以下部份翻譯ProGit [中文版v1](https://git-scm.com/book/zh-tw/v1/%E9%96%8B%E5%A7%8B) / [英文版v2](https://git-scm.com/book/en/v2), 加上自己一些測試。

-----------


為了要跟任何Git project協同工作, 我們需要知道如何管理remote repositories(遠端儲存庫).

Remote repositories 就是你的專案版本存在放網路某地方

我們可以擁有多個遠端儲存庫, 具備可讀或是可讀寫的權限。

## showing your remotes

`git remote` manage set of tracked repositories

```
$ git remote
origin
```

`origin`是預設我們從伺服器clone回來的預設遠端儲存庫簡稱(shortname)。

可以加入`verbose`參數: 

```
$ git remote -v 
origin  git@github.com:luchoching/myJblog.git (fetch)
origin  git@github.com:luchoching/myJblog.git (push)
```

有多個就會列出多個

This means we can pull contributions from any of these users pretty easily. 

不過這裡我們看不出是否有權限可以push上去

## Adding remote repositories

`git remote add [shortname] [url]`:  

```
$ git remote add pb https://github.com/paulboone/ticgit
```

## Fetching and pulling from your remote:

`git fetch [remote-name]` :

```
$ git fetch pb
From https://github.com/paulboone/ticgit
 * [new branch]      master     -> pb/master
 * [new branch]      ticgit     -> pb/ticgit
```

The command goes out to that remote project and pulls down all the data from that remote project that you don’t have yet. 

After you do this, you should have references to all the branches from that remote, which you can merge in or inspect at any time.

如果我們是clone一個repository, 那git就會幫我們把這個remote repository用這個`origin`名字代表, 所以`git fetch origin`表示把從你clone回來到現在在遠端儲存庫的改變都pull回來

當然, **git fetch 回來的資料不會自動merge**(不然影響現有的資料與工作就天下大亂了), 必須等我們手邊工作都確認了才進行merge。

如果我們有分支是設定追蹤遠端分支的, 就可以使用`git pull`來自動fetch + merge

`git clone`預設自動設定追蹤remote master branch(從你clone回來的那個儲存庫)

## Pushing to your Remotes 

當我們在我們這個project的某個時間點我們想要分享的, 就可以使用`git push [remote-name] [branch-name]`,

例如我要push我的master branch到`origin server`: 

```
$ git push origin master
```

當然這個指令要你有寫入的權限, 並且同時間沒有其他人做push或是clone的動作

 If you and someone else clone at the same time and they push upstream and then you push upstream, your push will rightly be rejected. You’ll have to pull down their work first and incorporate it into yours before you’ll be allowed to push.

## Inspecting a remote

查看更多特定remote資訊, 使用`git remote show [remote-name]`

## Removing and renaming remotes 

`git remote rename`: 

``` 
$ git remote rename pb paul
$ git remote
origin
paul
```

會改變原先的remote branch names, 例如`pb/master`會變成`paul/master`

當我們已經移除remote server, 或是不再使用特定的mirror, 或是貢獻者不再貢獻這個contribution, 就用`git remote rm `

