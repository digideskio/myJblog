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

ubuntu bash已經內建一些好用alias: 

```
alias ll='ls -alF'                                                                           
alias la='ls -A'                                                                             
alias l='ls -CF'
```



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

  - `/etc/passwd` : it is here that users are defined
  - `/etc/fstab`: contain a table of  devices that get mounted when your system boots.
  - `/etc/hosts`: this file lists the network host names and IP address that are intrinsically known to the system.
  - `/etc/init.d`: this directory contains the scripts that start various system services typically at boot time.

`/bin`, `/usr/bin`:  contain most of the programs for the system. The `/bin` directory has the esssntial programs that the system requires to operate, `/usr/bin` contains applications for the system's users.

`/sbin`, `/usr/sbin`: for superuser

`/usr`: contains variety of things that support user applications.:

  - `/usr/share/X11`: support files for the X Window system
  - `/usr/share/dict`: for the spelling checker.
  - `/usr/share/doc`
  - `/usr/share/man`
  - `/usr/src`: source code files. ex: kernel source codes

`/usr/local`: for the installation of software and other files for use on the local machine. What this really means is that **software that is not part of the official distribution goes here**(不然就會到`usr/bin`去)

`/var`: contains files that changes as the system is running:

  - `/var/log`: you should view the files from time to time, to monitor the health of your system.
  - `/var/spool`: is used to hold files that are queued for some process, such as mail messages and print jobs.

(未完, 直接看doc)

## Manipulating Files

`cp`: copy files and directories

`mv`: move or rename files and directories

`rm`: remove(delete) files and directories

`mkdir`: create directories

可以這樣: `mv file1 file2 file3 dir1`

## Working with Commands 

`type`: display information about command type

```
$ type gla
gla is aliased to `git la'
$ type ls
ls is aliased to `ls --color=auto'
$ type ll
ll is aliased to `ls -al'
$ type cp
cp is /bin/cp
```

`which`: locate a command

```
$ which ls
/bin/ls
$ which git
/usr/bin/git
```

`help`

`man`

## I/O Redirection

send to standard output: 

```
$ ls > file_list.txt
$ ls >> file_list.txt
```

**standard input**: 

`sort`: sort lines of text files

```
$ sort < file_list.txt
```

**注意**: 

```
$ sort < file_list.txt > sorted_file_list.txt
```

會先執行`sort < file_list.txt` 將結果output到 `sorted_file_list.txt`

### cmd Pipelines

The standard output of one command is fed into the standard input of another: 

```
$ ls -l | less
```

the output of the `ls` command is fed into `less`.

**filters**: take standard input and perform an operation upon it and send the results to statndard output.

通常命令組合跟filter搭配, 例如`sort`, `grep`, `fmt`, `sed`, `awk`

## Expansion

`echo`: prints out its text arguments on standard output.

```
$ echo this is a test
this is a test
```

利用`echo`作測試

```
$ echo text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER
text /home/parks/test.json.txt a b foo 4 parks
$ echo "text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER"
text ~/*.txt {a,b} foo 4 parks
$ echo 'text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER'
text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER
```
## Permissions

`chmod`: modify file access rights

`su`, `sudo`: temporarily become the superuser (在ubuntu用`sudo`)

`chown`: change file ownership

`chgrp`: change a file's group ownership

![f1](http://linuxcommand.org/images/file_permissions.png)

## Job Control 

`ps`: list the processes running on the system

`kill`: send a signal to one or more processes (usually to kill a process)

`jobs`: an alternate way of listing your own processes

`bg`: put a process in the background

`fg`: put a process in the forground

按 `Ctrl-Z` 表示將process暫停, 該process還在

## alias 

`$ alias` 列出所有bash alias

[bash alias examples](http://www.thegeekstuff.com/2010/04/unix-bash-alias-examples/)

將aliases抽出到`~/.bash_aliases`, 

讓vim可以顯示`.bash_aliases`語法標示: 

用root修改`/usr/share/vim/vim74/filetype.vim`, 搜尋`bashrc`, 在： 

```
au BufNewFile,BufRead .bashrc*,bashrc,bash.bashrc,.bash_profile*,.bash_logout*,*.bash,*.ebuild call SetFileTypeSH("bash")
```

加入`.bash_aliases`即可

## cat command 

[參考](http://www.cyberciti.biz/faq/howto-use-cat-command-in-unix-linux-shell-script/)

`cat filename` 讀取檔案

`cat > filename` 建立新檔案

`cat options filename`

`cat file1 file2`

`cat file1 file2 > file3` 合併檔案

預設`cat`會把output輸出到螢幕, 現在redirect到另外一個檔案:  

```
$ cat /etc/passwd > /tmp/test.txt
```

或是: 

```
$ cat /etc/hosts /etc/resolv.conf /etc/fstab > /tmp/outputs.txt
$ cat /tmp/outputs.txt
```

新增檔案(save and exit 按下`ctrl+D`): 

```
$ cat > foo
this is a test
$ cat foo
this is a test
$ cat >> foo
more
$ cat foo
this is a test
more
```

以下COOL!: 

```
$ cat file1 - file2 > file3
```

`-`表示鍵盤輸入, 會把file1加上你鍵盤輸入內容加上file2的內容, 輸出給file3

`-b`(number non-blank), `-n`(number): 

```
$ cat -b foo
     1  this is a test
     2  more

     3  cc
     4  dd
$ cat -n foo
     1  this is a test
     2  more
     3  
     4  cc
```

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
