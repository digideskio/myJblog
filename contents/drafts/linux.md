# [Linux]相關

---------

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
------

## /bin/sh -c 

/bin/sh is usually a symlink to a shell.

```
$ bash -c ls
```

will launch bash and execute the command ls.

## apt-get -yqq

`-qq`選項說明 :

[what does qq argument for apt-get mean](http://serverfault.com/questions/644180/what-does-qq-argument-for-apt-get-mean)


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

## 好用的bash alias 

[Ask HN: Share your favourite bash/zsh aliases](https://news.ycombinator.com/item?id=9869231)

## find, grep, awk

`grep -r "yourtext" --include "*.txt" .` 


## Google Chrome shortcut

[chrome shortcut](https://support.google.com/chrome/answer/157179?hl=en)

`Ctrl+F`找符合字串, 按`Enter`找下個符合字串, `Shift+Enter`找前個符合字串

back --> `Alt+left` , forward --> `Alt + right`

focus on url bar --> `alt + d` 或 `F6` 或 `ctrl+L`


## curl 和 wget的區別

http://unix.stackexchange.com/questions/47434/what-is-the-difference-between-curl-and-wget


## More 

[Linux Command & Shell Scripts學習](http://linuxcommand.org/index.php)
