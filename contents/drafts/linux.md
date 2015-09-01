# [Linux]指令  linuxcommand.org

看[linuxcommand.org](http://linuxcommand.org/)逐步學習!! 


What is the **Shell** --> the shell is a program that takes commands from the keyboard and gives them to the operating system to perform. ex: bash, zsh

What is a **Terminal** --> It's a program called a *terminal emulator*. This is a program that opens a window and lets you interact with the shell. ex: gnome-terminal, xterm

> command -options arguments

## Navigation 

`$ pwd`: print working directory

`$ cd`: change directory

`$ ls`: list files and directories

`$ ls -l`: in long format

a close look of long format: 

![lsl](http://imgur.com/XYeEqRQl.png)


如果`$ cd`後面沒有接參數, `cd`就會把working directory從目前的目錄切換到`/home/yourusername` directory.

`$ less text_file` : let you view text files. 可用page up , page down, `G`到檔案底部, `1G`到檔案開頭, 也可`/characters` search ,用`n`repeat previous search


`$ file name_of_file`: `file` will examine a file and tell you what kind of file it is.

例如：

```
$ file 2015-08-28-git_9_remote_branches.html 
2015-08-28-git_9_remote_branches.html: HTML document, UTF-8 Unicode text, with very long lines
```

## linux 檔案結構(part)

`/boot`: linux kernel and boot loader files.  kernel file叫作`vmlinuz`

`/etc`: contain the configuration files for the system.  (All of the files in /etc should be text files)

  - `/etc/passwd` 檔案: it is here that users are defined
  - `/etc/fstab`檔案 : contain a table of  devices that get mounted when your system boots.


## cmd Pipelines

```
$ ls -l | less
```

the output of the `ls` command is fed into `less`.



## group & user 管理

列出你所屬的group :  `$ groups`

`$ groups yourusername` 或 `$group root` 列出該user所屬的group

或是: 

```
$ id -Gn
$ id -Gn yourusername
$ id -Gn root
```

find out my primary group membership: 

```
$ getent group yourusername
yourusername:x:1000:
```

user `yourusername` has group id # 1000 and has group name `yourusername` for primary group membership.



列出所有group: `/etc/group` 或是: `getent group | cut -d: -f1`




## cut 


## 利用 sed 做搜尋與取代

sed - stream editor for filtering and transforming text

 -i[SUFFIX] : edit files in place (makes backup if SUFFIX supplied)

 > sed -i'' 's/1000/3000'


## xfce4-terminal

http://www.webupd8.org/2013/01/how-to-use-xfce4-terminal-06x-as-drop.html

``` 
$ xfce4-terminal --drop-down
```

在快速鍵設定這個指令為`F12` 就可以快速開啟中央terminal! 


## 建立目錄並且切換到新的目錄:

```
$ mkdir /home/foo/test && cd $_
```

## echo 新增檔案內容

``` 
$ echo "hello" > test.md
$ echo "go" >> test.md
```

輸出

```
$ more test.md
hello
go
```

## 好用的bash alias 

[Ask HN: Share your favourite bash/zsh aliases](https://news.ycombinator.com/item?id=9869231)


## Google Chrome shortcut

[chrome shortcut](https://support.google.com/chrome/answer/157179?hl=en)

`Ctrl+F`找符合字串, 按`Enter`找下個符合字串, `Shift+Enter`找前個符合字串

back --> `Alt+left` , forward --> `Alt + right`

focus on url bar --> `alt + d` 或 `F6` 或 `ctrl+L`


## More 

[Linux Command & Shell Scripts學習](http://linuxcommand.org/index.php)
