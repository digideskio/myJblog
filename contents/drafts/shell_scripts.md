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

注意`VARIABLE_NAME=` 等號跟變數名字間不能有空格

另外, `${VARIABLE_NAME}`: 

```
#!/bin/sh
# This program will read the filename 
# from user input.

echo "Enter the file: "
read FILENAME
echo "Printing head of ${FILENAME}_LOG..."
head ${FILENAME}_LOG

echo ""  #this prints an extra return...
echo "Printing tail of ${FILENAME}_LOG..."
tail ${FILENAME}_LOG
```


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

**注意!** comparion operators 寫法不太一樣, 參考 [other comparison operators](http://www.tldp.org/LDP/abs/html/comparison-ops.html): 

comparisons: 

- `-eq`: equal to
- `-ne`: not equal to
- `-lt`: less than
- `-le`: less than equal to
- `gt`,`gte`

File Operations: 

- `-s`: file exists and is not empty
- `-f`: file exist and is not a directory
- `-d`: directory exists.
- `-x`, `-w`, `-r`: file is executable 

可以利用`||` 和 `&&`組合條件式: 

```
#!/bin/sh

# Prompt for a user name...
echo "Please enter your age:"
read AGE

if [ "$AGE" -lt 20 ] || [ "$AGE" -ge 50 ]; then
  echo "Sorry, you are out of the age range."
elif [ "$AGE" -ge 20 ] && [ "$AGE" -lt 30 ]; then
  echo "You are in your 20s"
elif [ "$AGE" -ge 30 ] && [ "$AGE" -lt 40 ]; then
  echo "You are in your 30s"
elif [ "$AGE" -ge 40 ] && [ "$AGE" -lt 50 ]; then
  echo "You are in your 40s"
fi
```

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


**integer 和 string 使用不同的operators!**


## Flow control - part2 

`if..elif..else`: 

```
#!/bin/bash

echo -n "Enter a number between 1 and 3 inclusive > "
read character
if [ "$character" = "1" ]; then
    echo "You entered one."
elif [ "$character" = "2" ]; then
    echo "You entered two."
elif [ "$character" = "3" ]; then
    echo "You entered three."
else
    echo "You did not enter a number between 1 and 3."
fi
```

注意條件式: 

若為 `[ $character = "1" ]` 那使用者沒有輸入直接按enter結果會變成 `[ = "1" ]`會解析錯誤, 

若用`[ "$chracter" = "1" ]`使用者未輸入, 那結果就會變成`[ "" = "1" ]`就不會解析錯誤, 會跳到else block去。


`case`條件式: 

```
case word in
    patterns ) commands ;;
esac
```

範例：

```
#!/bin/bash

echo -n "Enter a number between 1 and 3 inclusive > "
read character
case $character in
    1 ) echo "You entered one."
        ;;
    2 ) echo "You entered two."
        ;;
    3 ) echo "You entered three."
        ;;
    * ) echo "You did not enter a number between 1 and 3."
esac
```

Patterns can be literal text or wildcards. You can have multiple patterns separated by the "|" character: 

```
#!/bin/bash

echo -n "Type a digit or a letter > "
read character
case $character in
                                # Check for letters
    [[:lower:]] | [[:upper:]] ) echo "You typed the letter $character"
                                ;;

                                # Check for digits
    [0-9] )                     echo "You typed the digit $character"
                                ;;

                                # Check for anything else
    * )                         echo "You did not type a letter or a digit"
esac
```

注意letter大小寫條件式的寫法

### loops 

`while`, `until`, `for`

`while`: 

```
#!/bin/bash

number=0
while [ "$number" -lt 10 ]; do
    echo "Number = $number"
    number=$((number + 1))
done
```

利用`util`達到上述功能(注意條件式不同, 因為語意不同):

```
#!/bin/bash

number=0
until [ "$number" -ge 10 ]; do
    echo "Number = $number"
    number=$((number + 1))
done
```

### example 

```
#!/bin/bash

press_enter()
{
    echo -en "\nPress Enter to continue"
    read
    clear
}

selection=
until [ "$selection" = "0" ]; do
    echo "
    PROGRAM MENU
    1 - display free disk space
    2 - display free memory

    0 - exit program
"
    echo -n "Enter selection: "
    read selection
    echo ""
    case $selection in
        1 ) df ; press_enter ;;
        2 ) free ; press_enter ;;
        0 ) exit ;;
        * ) echo "Please enter 1, 2, or 0"; press_enter
    esac
done
```

## for loop 

```
#!/bin/sh
# Validate numbers...

echo "Please enter a list of numbers between 1 and 100. "
read NUMBERS

for NUM in $NUMBERS
do
  if [ "$NUM" -lt 1 ] || [ "$NUM" -gt 100 ]; then
    echo "Invalid Number ($NUM) - Must be between 1 and 100!"
  else
    echo "$NUM is valid."
  fi
done
```

## Reading & Writing Files 

[參考](http://www.dreamsyssoft.com/unix-shell-scripting/read-write-files-tutorial.php)

`$1` 表示第一個參數, 例如`sh test.sh`, 那`$1`就是`test.sh`


## More 

[UNIX & Linux Shell Scripting Tutorial](http://www.dreamsyssoft.com/unix-shell-scripting/tutorial.php): 也是不錯的參考
