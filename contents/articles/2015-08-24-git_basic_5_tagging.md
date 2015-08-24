# [Git] basics -- Tagging

以下部份翻譯ProGit [中文版v1](https://git-scm.com/book/zh-tw/v1/%E9%96%8B%E5%A7%8B) / [英文版v2](https://git-scm.com/book/en/v2), 加上自己一些測試。

-----------

通常用來tag版本 

列出版本號: `git tag`

版本號很多, 只列出有興趣的話: `git tag -l v1.4.*`

## Createing Tags

lightweight tag : 僅只是指到特定commit的指標, 就像是該個commit的alias

annotated tag: 就是一個在Git database裏面完整的object, 包含tagger name, email, date, tagging message, 並可以被GNU Privacy Guard (GPG)簽署和驗證 

建議用annotated tag: 

```
$ git tag -a v0.1 -m 'my version 0.1'
$ git tag
v0.1
```

`-a`(`--annotate`): Make an unsigned, annotated tag object

新增lightweight tag: 

```
$ git tag v0.1-lw
```

Tagging later 追加標籤:

```
$ git tag -a v1.2 9fceb02
```


## 查詢tag

`git show`: Show various types of objects

若用`git show`查詢annotated tag: 

```
$ git show v0.1
tag v0.1
Tagger: Lu Cho-Ching <choching.work@gmail.com>
Date:   Mon Aug 24 13:24:04 2015 +0800

my version 0.1

commit 05155664169962376d3d212d57ea0271cfa75c3f
Author: Lu Cho-Ching <choching.work@gmail.com>
Date:   Mon Aug 17 15:41:16 2015 +0800

  test commit

diff --git a/1.txt b/1.txt
new file mode 100644
index 0000000..d00491f
--- /dev/null
+++ b/1.txt
@@ -0,0 +1 @@
+1
....
```

注意最開始就會顯示tag名字, tagger, date, 還有tag commit message 

若用`git show` lightweight message : 

```
$ git show v0.1-lw
commit 05155664169962376d3d212d57ea0271cfa75c3f
Author: Lu Cho-Ching <choching.work@gmail.com>
...
```

只顯示該commit資訊。

## Sharing Tags

預設`git push`沒有傳送tags到遠端server去, 要用`git push origin [tagname]`:

```
$ git push origin v1.5
```

如果有很多tags要push: 

```
$ git push origin --tags
```

## Checking out Tags 

從特定tag分支出去 `git checkout -b [branchname] [tagname]`:

```
$ git checkout -b version2 v2.0.0
```

-----------

