# [Git] basics --  Viewing the Commit History - git log

以下部份翻譯ProGit [中文版v1](https://git-scm.com/book/zh-tw/v1/%E9%96%8B%E5%A7%8B) / [英文版v2](https://git-scm.com/book/en/v2), 加上自己一些測試。

-----------

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

## --pretty

`git log --pretty=oneline`

`git log --pretty=format:`

[pretty format 參考](http://git-scm.com/docs/pretty-formats)


## filter log

[Filtering the Commit History](https://www.atlassian.com/git/tutorials/git-log/filtering-the-commit-history)

By date: `git log --after="2015-08-06" --before="2015-08-17"`

By message: `git log --grep="JRA-224:"`, 加`-i` 忽略大小寫

By file: 我只對某些特定檔案有興趣 `git log foo.py bar.py`, 其他參數要加在檔案路徑之前, 例如`git log --stat -2 package.json server.js`

By Content: 例如找說`Hello World`在什麼時候加入到哪個檔案的, 可用`git log -S"Hello World"`, `git log -G`為regex
