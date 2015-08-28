#[Git] Branching - Rebasing

以下部份翻譯ProGit [中文版v1](https://git-scm.com/book/zh-tw/v1/%E9%96%8B%E5%A7%8B) / [英文版v2](https://git-scm.com/book/en/v2), 加上自己一些測試。

-----------

在Git中有兩種主要方法將一個branch的改變整合到另外一個branch: `merge`和`rebase`

## The Basic Rebase

![b1](https://git-scm.com/book/en/v2/book/03-git-branching/images/basic-rebase-1.png)

使用`merge`:

![b2](https://git-scm.com/book/en/v2/book/03-git-branching/images/basic-rebase-2.png)

`merge`做了three-way merge, 兩個最新的branch snapshoots`C3`和`C4`,加上兩個共同的祖先`C2`, 建立了一個新的snapshoot(and commit)

還有另外一個選擇：你可以把在 `C4` 裡產生的變化補丁在 `C3` 的基礎上重新打一遍。在 Git 裡，這種操作叫作`rebasing`。有了 rebase 命令，就可以把在一個分支裡提交的改變移到另一個分支裡重放一遍, 例如:

```
$ git checkout experiment
$ git rebase master
```

它的原理是回到兩個分支最近的共同祖先，根據當前分支（也就是要進行衍合的分支 `experiment`）後續的歷次提交物件（這裡只有一個 `C3`），生成一系列檔補丁，然後以基底分支（也就是主幹分支 master）最後一個提交物件（`C4`）為新的出發點，逐個應用之前準備好的補丁檔，最後會生成一個新的合併提交物件（`C3'`），從而改寫 experiment 的提交歷史，使它成為 master 分支的直接下游:

It works by going to the common ancestor of the two branches (the one you’re on and the one you’re rebasing onto), getting the diff introduced by each commit of the branch you’re on, saving those diffs to temporary files, resetting the current branch to the same commit as the branch you are rebasing onto, and finally applying each change in turn.


![b3](https://git-scm.com/book/en/v2/book/03-git-branching/images/basic-rebase-3.png)

回到`master`, 進行fast forward合併:

```
$ git checkout master
$ git merge experiment
```

![b4](https://git-scm.com/book/en/v2/book/03-git-branching/images/basic-rebase-4.png)

得到的結果`C4'`和merge產生的結果`C5`是一樣的

但是 rebaseing 得到一個更乾淨清楚的history歷史紀錄, 看起來像是一個線性的順序進行的歷史紀錄, 儘管他們實際上曾經並行發生的

Often, **you’ll do this to make sure your commits apply cleanly on a remote branch – perhaps in a project to which you’re trying to contribute but that you don’t maintain.**

當我們先在自己的branch開發好,準備要向我們的遠端main project提交patch的時候,  我們先基於`origin/master`作`rebase`, 這樣管理者就不需要再作任何整合工作了, 直接fast forward或是直接採納你的patch


注意不管是經由`merge`或是`rebase`所產生最後一次commit所指向的snapshot, 都是相同的, 差別只在commit history不同。 rebasing 是按照每行的修改次序重演一遍修改，而 merge 是把最終結果合在一起。


## more interesting rebase

例如: 

![b5](https://git-scm.com/book/en/v2/book/03-git-branching/images/interesting-rebase-1.png)

假設我想要merge我的client到主線去準備release用, 但是我想先保留server等測試好了再合併,

那我們可以拿server上所沒有的改變(`C8`和`C9`)在master上重做(replay)一遍, 利用`git rebase`加上`--onto` option:

```
$ git rebase --onto master server client
```

上述命令的意思是說: **取出(checkout)這個client branch, 找出基於client和server共同祖先之後的變化(patches), 在master重新replay一遍**

結果為:

![b6](https://git-scm.com/book/en/v2/book/03-git-branching/images/interesting-rebase-2.png)

再來就可以fast forward我們的master branch: 

```
$ git checkout master
$ git merge client
```

![b7](https://git-scm.com/book/en/v2/book/03-git-branching/images/interesting-rebase-3.png)

最後我們決定要把server branch也包含進來, 不需要先checkout到server branch再做rebase, 只要執行`git rebase [basebrach] [topicbranch]`就成, 這命令會先checkout到topic branch, 然後在base branch執行replay"

```
$ git rebase master server
```

![b7](https://git-scm.com/book/en/v2/book/03-git-branching/images/interesting-rebase-4.png)

再來就可以執行fast-forward, 刪除沒用的branches:

```
$ git checkout master
$ git merge server
$ git branch -d client
$ git branch -d server
```

![b8](https://git-scm.com/book/en/v2/book/03-git-branching/images/interesting-rebase-5.png)

## The Perils of Rebasing 風險

> Do not rebase commits that exist outside your repository

**一旦該branch裡的commits已經發佈到remote repository, 就不要再對該branch進行rebase!**

當我們做rebase的時候, 我們完全捨棄現有的commits, 而另外建立一個相似但是並不相同的commit。

如果你把某處的commits給pushh上去, 而其他人pull這些你push上去的commits下來, 並且當作他們的base在上面工作, 過了不久你竟然使用`git rebase`重寫了這些commits又在push上去... 

你合作的伙伴就還要重新merge一遍, 當我們又想要把這些伙伴的工作在pull回來的時候..情況會變得更混亂 XD

例如假設你從伺服器clone回來, 並且在上面做了些commits: 

![b9](https://git-scm.com/book/en/v2/book/03-git-branching/images/perils-of-rebasing-1.png)

再來有其他人做了些事情包含merge, 他把這些commits來push到server, 你從server在重新fetch, 把這個新的branch來merge到你的master: 

![b10](https://git-scm.com/book/en/v2/book/03-git-branching/images/perils-of-rebasing-2.png)

**原先push上來merge work的人決定改用rebase取代原來的merge**, 他執行了`git push --force`強制覆寫了server的歷史紀錄。你又重新fetch, 取得了新的commits: 

![b11](https://git-scm.com/book/en/v2/book/03-git-branching/images/perils-of-rebasing-3.png)

勢必要做合併:

![b12](https://git-scm.com/book/en/v2/book/03-git-branching/images/perils-of-rebasing-4.png)

如果這個時候`git log`, 會發現有兩個commits有相同的作者,日期, 還有相同的訊息令人疑惑

## Rebase When you Rebase

如果你真的發現有上述這樣的情形, Git也有強力工具可以幫忙

假設你團隊有人強制push改變上去,覆寫了你現在工作的基底, 你的挑戰就是找出哪些是你的, 哪些是他們被覆寫的

It turns out that in addition to the commit SHA-1 checksum, Git also calculates a checksum that is based just on the patch introduced with the commit. This is called a “patch-id”.

If you pull down work that was rewritten and rebase it on top of the new commits from your partner, Git can often successfully figure out what is uniquely yours and apply them back on top of the new branch.

如上述例子, 若執行`git rebase teamone/master`, Git會執行以下動作: 

1. 找出我們branch裏面哪些是unique的(`C2`, `C3`, `C4`, `C6`, `C7`)
2. 判斷哪些不是merge commits(`C2`,`C3`, `C4`)
3. 判斷哪些沒有被重寫到目標分支(只有`C2`,`C3`, 那`C4`和`C4'`是相同patch)
4. 採用這些commits到`teamone/master`的頂端

![b13](https://git-scm.com/book/en/v2/book/03-git-branching/images/perils-of-rebasing-5.png)

用`git pull --rebase`來簡化這些工作, 或是先`git fetch`再`git rebase teamone/mater`


## Rebase Vs. Merge

rebase和merge哪個比較好? 

利用history的角度來看

使用merge: your repository’s commit history is **a record of what actually happened**.

使用rebase:  the commit history is **the story of how your project was made**. 

取決...團隊, 經驗.... (more)  XD

一般來說, 就是把還沒push上去的changes作local rebase, 這樣就可以將你的story整理乾淨. 但是不要把你已經push上去的東西再rebase

