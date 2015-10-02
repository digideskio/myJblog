# [Git] Branches in a Nutshell 

以下部份翻譯ProGit [中文版v1](https://git-scm.com/book/zh-tw/v1/%E9%96%8B%E5%A7%8B) / [英文版v2](https://git-scm.com/book/en/v2), 加上自己一些測試。

-----------

Git不是儲存diff, 而是儲存整個snapshoot.

當我們commit, Git會存一個commit object, 這個object包含一個指標, 指到我們暫存(staged)的內容的snapshot, 也包含作者email,姓名, commit message, 指向前後commit的指標

![b1](https://git-scm.com/book/en/v2/book/03-git-branching/images/commit-and-tree.png)

如上圖, commit object包含一個指向tree的指標, 這個指向的tree object裏面包含了指向所包含暫存內容檔案(**blob**)的指標

![b2](https://git-scm.com/book/en/v2/book/03-git-branching/images/commits-and-parents.png)

增加了新的改變並且再度commit, 下一個commit object存了指向parent commit object的指標

那branch事實上就是一個可移動的輕量化指標, 指向某個特定commit

預設的branch名字叫作`master`, 當我們做了一些commits, `master` branch就會指向最新一個commit。每次新增一個commit, master branch指標就會自動往前移動

![b3](https://git-scm.com/book/en/v2/book/03-git-branching/images/branch-and-history.png)

## Creating a New Branch

```
$ git branch testing
```

表示我們建立一個可以四處移動的指標(pointer)

![b3](https://git-scm.com/book/en/v2/book/03-git-branching/images/two-branches.png)

Git利用一個特別的指標叫作`HEAD`, 來判定我們現在在哪個branch

如上個指令, 我們建立一個新的branch叫作testing, 但是我們還是在master branch上: 

![b4](https://git-scm.com/book/en/v2/book/03-git-branching/images/head-to-master.png)

利用以下來檢查branch: 

```
$ git log --oneline --decorate
745d9f1 (HEAD, testing, master) Add 111
21d8b07 Add 11
ffdb431 init commit
```

`--decorate` 會顯示出branch以及HEAD pointers。

## Switching Branches

`git checkout testing`

![b5](https://git-scm.com/book/en/v2/book/03-git-branching/images/head-to-testing.png)

切換到testing branch後, 在做其他的commit : 

```
$ echo "a" >> README
$ git commit -a -m 'made a change'
```

![b6](https://git-scm.com/book/en/v2/book/03-git-branching/images/advance-testing.png)

這個時候 testing branch向前, 但是 master branch還是指向原來的commit object, 利用`git checkout`切換到master branch:

```
$ git checkout master
```

![b7](https://git-scm.com/book/en/v2/book/03-git-branching/images/checkout-master.png)

**`git checkout`做了兩件事情**, 一個是將`HEAD`指標指向 master branch指標, 另外將working directory裏面的檔案資料轉回到原來master指標所指向的snapshoot。 

當我們切換branch, working directory內的檔案就會改變

我們在master branch做一些改變: 

```
$ echo "b" >> README
$ git commit -a -m 'made other change'
```

![b8](https://git-scm.com/book/en/v2/book/03-git-branching/images/advance-master.png)

利用`git log`查看branch概況: 

``` 
$ git log --oneline --decorate --graph --all
* bbcb306 (master) made another change
| * 6161eca (HEAD, testing) made a change
|/  
* 745d9f1 Add 111
* 21d8b07 Add 11
* ffdb431 init commit
```

