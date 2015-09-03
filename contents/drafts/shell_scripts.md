# [Shell Scripts]

http://linuxcommand.org/lc3_writing_shell_scripts.php

command太多記不完, 也不需要, we use the power of the shell to automate things.

We write *shell scripts*.


The shell is somewhat unique, in that it is both a powerful command line interface to the system and a scripting language interpreter. 

As we will see, most of the things that can be done on the command line can be done in scripts, and most of the things that can be done in scripts can be done on the command line.

**Scripts unlock the power of your Linux machine. **

## First Script 

1. Write a script
2. Give the shell permission to execute it
3. Put it somewhere the shell can find it

## Editing The Sciprts you already have

### Environment

Login shells read one or more startup files as shown below:

`/etc/profile`: A global configuration script that applies to all users.

`~/.bash_profile`: A user's personal startup file. Can be used to extend or override settings in the global configuration script.

`~/.profile`: default in Debian-bases distribution, such as Ubuntu

Non-login shell sessions read the following startup files: 

`/etc/bash.bashrc`: A global configuration script that applies to all users.

`~/.bashrc`: a user's personal startup file. Can be used to extend or override settings in the global configuration script.

`~/.profile`內容： 

``` bash
# if running bash
if [ -n "$BASH_VERSION" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
  . "$HOME/.bashrc"
    fi 
fi
# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/bin" ] ; then
    PATH="$HOME/bin:$PATH"
fi
```

### Shell Functions

Aliases are good for very simple commands, but if you want to create something more complex, you should try *shell functions*

Shell functions can be thought of as **scripts within scripts** or **little sub-scripts**.

## Here Scripts

> **command** << token

> content to be used as command's standard input

> token


`<<`和`<<-`的區別:  causes bash to ignore the leading tabs (but not spaces) in the here script.

## Variables

ex: 

``` 
title="My title"

echo $title
```

注意`VARIABLE_NAME=value` 等號跟變數名字間不能有空格

### environment variables 

When you start your shell session, some variables are already set by the startup file.

`printenv` 察看environment

[printenv HOSTNAME](http://ubuntuforums.org/showthread.php?t=1454440)

```
$ export HOSTNAME
$ printenv | grep HOST
```

### Command Substitution 

`$(date +"%x %r %Z")`:  `$()`告訴shell--> substitute the results of the enclosed command.

`$(command)`和 `` ` command ` `` 相同

也可以像是 `right_now=$(date +"%x")`

constants 可以用大寫來做區別

## Shell functions 

```
show_uptime(){
  echo "show up time"
}
```

## Flow Control

```
if commands; then
commands
[elif commands; then
commands...]
[else
commands]
fi
```

### Exit Status 

Commands (including the scripts and shell functions we write) issue a value to the system when they terminate, called an *exit status*. 

This value, which is an integer in the range of 0 to 255, indicates the success or failure of the command’s execution. 

`0`表示成功, 其他表示失敗

### test 

**很常用!!** 跟 if搭配做條件判斷

可以寫成 **test** *expression*  或是  **[** *expression* **]** 

```
if [ -f .bash_profile ]; then
    echo "You have a .bash_profile. Things are fine."
else
    echo "Yikes! You have no .bash_profile!"
fi
```

相當於比對 `test -f .bash_profile`的結果

### Semicolon 

分號(;)為 command sepator, allows you to put more than on command on a line , 例如`clear; ls`

### exit 

在我們script最後加上`exit 0` 可以讓script立刻中止,並且送出exit status. 

`exit 1`表示失敗

### superuser 

`id -u` 

```
if [ $(id -u) != "0" ]; then
    echo "You must be the superuser to run this script" >&2
    exit 1
fi
```

## set -x 

加入這行, shell script執行會顯示一行依行的動作(*tracing*)

## Keyboard 輸出輸入

`$ read`: takes input from the keyboard and assign it to a variable.

```
#!/bin/bash

echo -n "Enter some text > "
read text
echo "You entered: $text"
```

`echo -n`: do not output the trailing newline

Note that "-n" given to the echo command causes it to keep the cursor on the same line; i.e., it does not output a linefeed at the end of the prompt.


`read -t` : timeout input 設定

`read -s`: user's typing not to be displayed.

## arithmetic 

``` bash
#!/bin/bash

number=0

echo -n "Enter a number > "
read number

echo "Number is $number"
if [ $((number % 2)) -eq 0 ]; then
    echo "Number is even"
else
    echo "Number is odd"
fi
```

**注意!** `[ ]`和 expression 前後都要有空格

**注意!** comparion operators 寫法不太一樣, 參考 [other comparison operators](http://www.tldp.org/LDP/abs/html/comparison-ops.html)

**integer 和 string 使用不同的operators!**


## Flow control - part2 


## More 

[UNIX & Linux Shell Scripting Tutorial](http://www.dreamsyssoft.com/unix-shell-scripting/tutorial.php): 也是不錯的參考
