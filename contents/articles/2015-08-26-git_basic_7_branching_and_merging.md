# [Git] Basic Branching and Merging

以下部份翻譯ProGit [中文版v1](https://git-scm.com/book/zh-tw/v1/%E9%96%8B%E5%A7%8B) / [英文版v2](https://git-scm.com/book/en/v2), 加上自己一些測試。

-----------

## Basic Branching

假設已經開始開發專案, 並且已經有一些commits了: 

![b1](https://git-scm.com/book/en/v2/book/03-git-branching/images/basic-branching-1.png)

再來這時決定要解決issue-tracking system上的 issue #53: 

```
$ git checkout -b iss53
```

![b2](https://git-scm.com/book/en/v2/book/03-git-branching/images/basic-branching-2.png)

在iss53 branch上我們做了一些commits, iss53 branch指標理所當然就往前了: 

![b3](https://git-scm.com/book/en/v2/book/03-git-branching/images/basic-branching-3.png)


再來接到說網站有緊急issue要優先處理, 

我們不需要同時發佈(deploy)這個bug fix加上iss53所做的修改, 首先做的事情就侍從iss53 branch 切換到master branch

不過注意, **如果你的working directory或是 staging area還有未commit的改變, 這會和你正要checkout出去的分支產生衝突, Git會阻止你切換branch**

例如: 

```
$ git checkout  master 
error: Your local changes to the following files would be overwritten by checkout:
  README
Please, commit your changes or stash them before you can switch branches.
Aborting
```

除非將工作區域清乾淨(commit), 或是利用**namely, stashing以及commit amending**來解決

清好了才可以`git checkout master`

This is an important point to remember: when you switch branches, Git resets your working directory to look like it did the last time you committed on that branch. It adds, removes, and modifies files automatically to make sure your working copy is what the branch looked like on your last commit to it.

再來我們要做一個`hotfix` branch來把整個解決bug的事情做完:

```
$ git checkout -b hotfix
$ vim index.html
$ git commit -a -m 'fixed the broken email address'
```

![b4](https://git-scm.com/book/en/v2/book/03-git-branching/images/basic-branching-4.png)

測試hotfix若ok, 就可以把hotfix 合併回去master: 

``` 
$ git checkout master
$ git merge hotfix
Updating f42c576..3a0874c
Fast-forward
 index.html | 2 ++
 1 file changed, 2 insertions(+)
```

如果順著一個分支走下去可以到達另一個分支的話，那麼 Git 在合併兩者時，只會簡單地把指標右移，因為這種單線的歷史分支不存在任何需要解決的分歧，所以這種合併過程可以稱為`fast-forward`。

![b5](https://git-scm.com/book/en/v2/book/03-git-branching/images/basic-branching-5.png)

hotfix分支已經用不到了, 因為master branch指向的是同一個地方, 那就可以刪掉hotfix, 然後回到iss53 branch工作: 

```
$ git branch -d hotfix
$ git checkout iss53
$ vim index.html
$ git commit -a -m 'finished new footer'
```

![b6](https://git-scm.com/book/en/v2/book/03-git-branching/images/basic-branching-6.png)

注意這個時候 hotfix修改的內容並未包含到 iss53中, 

如果要納入這次的bug修改, 可以用`git merge master`把master合併到iss53, 或是等iss53完成後, 再將iss53的更新併入到master。

## Basic Merging

假設iss53已經做完了, 可以合併到master去, 做法跟合併hotfix一樣: 

```
$ git checkout master
Switched to branch 'master'
$ git merge iss53
Merge made by the 'recursive' strategy.
index.html |    1 +
1 file changed, 1 insertion(+)
```

Git做了三向merge : 

![b7](https://git-scm.com/book/en/v2/book/03-git-branching/images/basic-merging-1.png)

C2(共同祖先), C4 和 C5(兩個分支的末端)

這次沒有只是將pointer往前, Git建立一個新的snapshot commit, 這個commit有兩個parent(a merge commit):

![b7](https://git-scm.com/book/en/v2/book/03-git-branching/images/basic-merging-2.png)

Git會判斷用哪一個祖先來當作最佳的merge base

一樣merge後不再需要iss53 branch, 就可以刪除:

```
$ git branch -d iss53
```

## Basic merge conflicts

大多數時間合併沒有這麼順利

如果我們在兩個branch都改相同的檔案然後合併, Git不能清楚的合併他們, 可能就會看到如下的訊息:

```
$ git merge iss53
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

Git沒有辦法自動建立一個新的merge commit, 會先暫停等你解決衝突後再繼續。

`git status`:

```
$ git status
On branch master
You have unmerged paths.
  (fix conflicts and run "git commit")

Unmerged paths:
  (use "git add ..." to mark resolution)

    both modified:      index.html

no changes added to commit (use "git add" and/or "git commit -a")
```

`git status -s`:

```
$ git status
UU index.html
```

必須要編輯衝突的檔案來解決問題:

```
<<<<<<< HEAD
div id="footer">contact : email.support@github.com/div>
=======
div id="footer">
 please contact us at support@github.com
/div>
>>>>>>> iss53
```

`<<<<<<< HEAD` 就是我們HEAD指向所在(就是master), 到`=======`就是master branch所紀錄的內容, 

`=======` 到` >>>>>>> iss53`就是iss53 branch所紀錄的內容

解決方法要碼就是二者擇一, 或是由你親自整合到一起,例如以下：

```
div id="footer">
please contact us at email.support@github.com
/div>
```

選擇了兩者各自的部份內容, 然後移除所有的標記線

再來執行`git add`標記衝突已經解決, 再執行`git commit`完成merge

### 使用merge tool

```
$ git mergetool

This message is displayed because 'merge.tool' is not configured.
See 'git mergetool --tool-help' or 'git help config' for more details.
'git mergetool' will now attempt to use one of the following tools:
opendiff kdiff3 tkdiff xxdiff meld tortoisemerge gvimdiff diffuse diffmerge ecmerge p4merge araxis bc3 codecompare vimdiff emerge
Merging:
index.html

Normal merge conflict for 'index.html':
  {local}: modified file
  {remote}: modified file
Hit return to start merge resolution tool (opendiff):
```

Git預設使用`opendiff`

那我是想用`vimdiff`

