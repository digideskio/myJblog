# [Git] basics --  Undoing things

以下部份翻譯ProGit [中文版v1](https://git-scm.com/book/zh-tw/v1/%E9%96%8B%E5%A7%8B) / [英文版v2](https://git-scm.com/book/en/v2), 加上自己一些測試。

-----------

## Undo Commiting 

`git commit --amend` 

`git commit --amend file1, file2...`

用來re-commit上次的commit。如果沒有staged的檔案存在, 那`git commit --amend`就是用來修改上次的commit訊息, 如果有staged的檔案存在, `git commit --amend`就會在這次修改的commit中, 加入這次的staged檔案。

```
$ git commit -m 'init commit'
$ git add forgetten_file
$ git commit --amend
```

## Unstaging a Staged File

`git reset`: Reset the index but does not modify the working tree.

`git reset HEAD <filename>`

## Unmodifying( reverting) a Modified File 

`git checkout -- <filename>`

這是一個危險的指令, 所有在這檔案做的改動都會不見, 就好像我們重新拷貝新的檔案覆蓋上去一樣, 除非真的不要這個檔案了, 不然不建議這麼做。

假如想要保留這些改變, 但是想將這些改變在現在排除, 建議使用 **stashing**(備份) 以及 **branching**(分支)

在Git中任何已經committed的內容幾乎都可以復元。即時是在分支中被刪除的commits或是用`--amend`修改的commit都可以復元。但是沒有被commit的資料就幾乎無法救回了


