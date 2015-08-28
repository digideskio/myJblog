# [Git] Remote Branches

以下部份翻譯ProGit [中文版v1](https://git-scm.com/book/zh-tw/v1/%E9%96%8B%E5%A7%8B) / [英文版v2](https://git-scm.com/book/en/v2), 加上自己一些測試。

-----------

## remote branches 

Remote references 就是一些在你遠端repositiries的reference(pointers), 包括了branches, tags等等

`git ls-remote`列出有哪些remote references: 

```
$ git ls-remote
From git@github.com:luchoching/myJblog.git
81022d132fdfc372b77e5ff4172f2be4610e370a  HEAD
8c20268ecccc24d630de375c42a8bc6e6defd252  refs/heads/add_page_bar
81022d132fdfc372b77e5ff4172f2be4610e370a  refs/heads/master
ff57d7d9a80a57f96be0e894e7c4cdb880c84609  refs/heads/materail-style
df3566a53b1d19bae1b78b865b13b717a254cbf1  refs/heads/new-style
```

或是`git remote show (remote)`: 

```
$ git remote show origin
* remote origin
  Fetch URL: git@github.com:luchoching/myJblog.git
  Push  URL: git@github.com:luchoching/myJblog.git
  HEAD branch: master
  Remote branches:
    add_page_bar   tracked
    master         tracked
    materail-style tracked
    new-style      tracked
  Local branch configured for 'git pull':
    master merges with remote master
  Local ref configured for 'git push':
    master pushes to master (up to date)
```

最常用的, 還是利用 remote-tracking branches的優點

Remote-tracking branches 就是紀錄遠端分支狀態的reference, 這些都是我們不能移動的local references, 只有當我們做任何網路溝通的時候他們才會自動移動

Remote-tracking branches就好像書籤(bookmarks)提醒你, 你最後跟遠端respositories連線的時候, 那些在遠端repositories的branches是在什麼位置

`(remote)/(branch)`

例如你想要看 在你的`origin` remote的 `master` branch最後我跟他們連線的時候是什麼模樣, 我們就可以檢查`origin/master` branch

又假設你的伙伴push上去一個`iss53` branch, 我可能也有自己的local的`iss53`, 那server上的這個branch, 會指向`origin/iss53`的commit

進一步說明, 假設你有一個Git server在網路上叫作`git.ourcompany.com`, 如果我clone, Git就會自動把遠端倉庫`git.ourcompany.com`叫作`origin`, pull拉下所有資料, 建立一個指向這個遠端倉庫的`master`的指標, 在local端命名為`origin/master`, 但是我們沒有辦法在local端更改資料, 
接著Git就會建立一個屬於你自己的local端的`master` branch, 一開始, 兩個branches都指向相同的位置: 

![b1](https://git-scm.com/book/en/v2/book/03-git-branching/images/remote-branches-1.png)

如果你在本地 master 分支做了些改動，與此同時，其他人向 git.ourcompany.com 推送了他們的更新，那麼伺服器上的 master 分支就會向前推進，而於此同時，你在本地的提交歷史正朝向不同方向發展。不過只要你不和伺服器通訊，你的 origin/master 指標仍然保持原位不會移動:

![b2](https://git-scm.com/book/en/v2/book/03-git-branching/images/remote-branches-2.png)

`git fetch origin` 會去找哪一個server叫作`origin`, 然後從該server擷取我們local都還沒有的資料下來, 更新我們的local database, 移動我們的`origin/master`到新的位置:

![b3](https://git-scm.com/book/en/v2/book/03-git-branching/images/remote-branches-3.png)

假設你還有另一個僅供你的敏捷開發小組使用的內部伺服器`git.team1.ourcompany.com`, 利用`git remote add teamone git.team1.ourcompany.com`加入成為我們的remote reference之一: 

![b4](https://git-scm.com/book/en/v2/book/03-git-branching/images/remote-branches-4.png)

利用`git fetch teamone`取得該server裏面我們local server沒有的資料, 因為teamone是origin的subset, 所以只有加上`teamone/master` branch pointer

![b5](https://git-scm.com/book/en/v2/book/03-git-branching/images/remote-branches-5.png)

## Pushing 

當我想要跟大家分享我的branch, 我需要把我的分支**push** up到我有寫入權限的remote去

你的local branches不會自動和你的remote同步, 你必須明確的將你要分享的分支 push上去

也就是說, 對於無意分享的分支，你儘管保留為私人分支好了，而只推送那些協同工作要用到的特性分支。 

如果你有的branch叫作`serverfix`,你想要跟其他人一起合作, 你就可以用`git push (remote) (branch)`的方式push該分支到remote去：

```
$ git push origin serverfix
Counting objects: 24, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (15/15), done.
Writing objects: 100% (24/24), 1.91 KiB | 0 bytes/s, done.
Total 24 (delta 2), reused 0 (delta 0)
To https://github.com/schacon/simplegit
 * [new branch]      serverfix -> serverfix
```

這裡其實走了一點捷徑。

Git 自動把 serverfix 分支名擴展為 `refs/heads/serverfix:refs/heads/serverfix`，意為“取出我在本地的 serverfix 分支，推送到遠端倉庫的 serverfix 分支中去”。我們將在第九章進一步介紹 `refs/heads/` 部分的細節，不過一般使用的時候都可以省略它。

也可以運行 `git push origin serverfix:serverfix` 來實現相同的效果，它的意思是“上傳我本地的 serverfix 分支到遠端倉庫中去，仍舊稱它為 serverfix 分支”。

通過此語法，你可以把本地分支推送到某個命名不同的遠端分支：若想把遠端分支叫作 awesomebranch，可以用 `git push origin serverfix:awesomebranch` 來推送數據。


接下來，當你的協作者再次從伺服器上獲取資料時，他們將得到一個新的遠端分支 origin/serverfix，並指向伺服器上 serverfix 所指向的版本：

```
$ git fetch origin
remote: Counting objects: 7, done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 0), reused 3 (delta 0)
Unpacking objects: 100% (3/3), done.
From https://github.com/schacon/simplegit
 * [new branch]      serverfix    -> origin/serverfix
```

**注意! 當你從fetch回來新的remote-tracking branches, 你並不會自動有一個可編輯的副本(editable copies), 換句話說, 你不會有一個新的`serverfix` branch, 你只有一個不能修改(無法移動)的`origin/serverfix`指標**

我們可以把這個`origin/serverfix` merge到我們目前的working branch: `git merge origin/serverfix`

或是你想要自己的`serverfix` branch, 那我們可以基於我們的remote-tracking branch來建立: 

```
$ git checkout -b serverfix origin/serverfix
```

這會切換到新建的 serverfix 本地分支，其內容同遠端分支 origin/serverfix 一致，這樣你就可以在裡面繼續開發了。


## Tracking Branches

從一個remote-tracking分支checkout出來的local branch, 我們叫作`tracking branch`(或是叫作`upstram branch`)

Tracking branch 為local branch, 和某個remote branch有直接關聯, 如果在這個分支直接`git pull`, Git就會知道從哪個server來fetch遠端追蹤的分支回來, 並且執行merge

就像我們clone回來一個repository, Git就會自動建立master branch, 並且追蹤`origin/master`(這也是依開始why `git push`, `git pull`可以正常工作的原因)

當然，你可以隨心所欲地設定為其它跟蹤分支，比如 origin 上除了 master 之外的其它分支。`git checkout -b [branch] [remotename]/[branch]`可以用`--track`簡化:

```
$ git checkout --track origin/serverfix 
Branch serverfix set up to track remote branch serverfix from origin.
Switched to a new branch 'serverfix'
```

要設定不同名字：

```
$ git checkout -b sf origin/serverfix
Branch sf set up to track remote branch serverfix from origin.
Switched to a new branch 'sf'
```

如果你有現成的local branch, 你現要追蹤你剛才pull dwon下來的remote branch, 或是要改變目前所追蹤的upstream branch, 利用`-u`或`--set-upstream-to`: 

```
$ git branch -u origin/serverfix
Branch serverfix set up to track remote branch serverfix from origin.
```

利用`git branch -vv`一起列出local branch和其追蹤的branch:

```
$ git branch -vv
  iss53     7e424c3 [origin/iss53: ahead 2] forgot the brackets
  master    1ae2a45 [origin/master] deploying index fix
* serverfix f8674d9 [teamone/server-fix-good: ahead 3, behind 1] this should do it
  testing   5ea463a trying something new
```

第1行說 `iss53`正在追蹤 `origin/iss53`, `ahead 2`表示我們有兩個local的commit還沒有push到server去

`serverfix`, `ahead 3`表示我們local有3個還沒push到server去, `behind 1`表示server還有一個commit我們還沒有merge

`testing`沒有追蹤任何remote branch

注意這些都是local的cache紀錄, 要確保這樣的資料正確, 要`git fetch --all; git branch -vv`

## Pulling 

`git fetch`會把server上我們還沒有的改變全部fetch回來, 但是這個動作並不會修改我們的working directory, 只是把資料抓下來讓我們自己merge.

**`git pull`本質上就是`git fetch`後立刻`git merge`**

Pro Git這本書建議使用`git fetch`+`git merge`這樣比較明確。

## Deleting Remote Branches

使用`git push`加上`--delete`:

```
$ git push origin --delete serverfix
To https://github.com/schacon/simplegit
 - [deleted]         serverfix
```

