# [Docker] Container -- 操作

來自於 [dockerbook](http://www.dockerbook.com/)與官網操作手冊的整理, 列一下目前有用到的指令與參數, 儘可能依照情境順序排列指令。

陸續加範例

## 什麼是 Container 

Docker helps you build and deploy containers inside of which you can package your applications and services.

**Containers are launched fromn images and can contain one or more running processes**

you can think about **images as the building or packing aspect of Docker and the containers as the running or execution of Docker**.

A Docker container is : 

  - an image format
  - a set of standard operations
  - an execution environment
  
## Run our first container 

```
$ docker run -i -t ubuntu /bin/bash
root@c5328777e0a0:/# 
```

The `-i` flag starts an interactive container. The `-t` flag creates a pseudo-TTY that attaches stdin and stdout.

利用`$ docker help run`察看可用flags 

這裡告訴Docker我們使用`ubuntu`來當作base image在我們的檔案系統裏面建立一個container。

這個container有自己的network, IP address, 還有一個bridge interface來跟local host溝通

```
root@c5328777e0a0:/# hostname
root@c5328777e0a0:/# cat /etc/hosts 
root@c5328777e0a0:/# ip a 
root@c5328777e0a0:/# ps -aux
root@c5328777e0a0:/# apt-get update && apt-get install vim
```

打`exit`跳出

一旦我們跳出container, 命令(`/bin/bash`)就停止執行, container中止

## Container commands

### run (陸續補充)

run a command in a new container. 

例如 `$ docker run -i -t --name=my_container ubuntu /bin/bash`就會從`ubuntu` image 建立一個新的container叫作`my_container`, 並且執行`/bin/bash`指令開啟一個bash shell.

-a, --attach=[]                 Attach to STDIN, STDOUT or STDERR

--add-host=[]                   Add a custom host-to-IP mapping (host:ip)

-d, --detach=false              Run container in background and print container ID

-e, --env=[]                    Set environment variables

--entrypoint=                   Overwrite the default ENTRYPOINT of the image

--env-file=[]                   Read in a file of environment variables

--expose=[]                     Expose a port or a range of ports

--group-add=[]                  Add additional groups to join

-h, --hostname=                 Container host name

-i, --interactive=false         Keep STDIN open even if not attached

-l, --label=[]                  Set meta data on a container

--label-file=[]                 Read in a line delimited file of labels

--link=[]                       Add link to another container

--name=                         Assign a name to the container

-P, --publish-all=false         Publish all exposed ports to random ports

-p, --publish=[]                Publish a container's port(s) to the host

--read-only=false               Mount the container's root filesystem as read only

--restart=no                    Restart policy to apply when a container exits

--rm=false                      Automatically remove the container when it exits

-t, --tty=false                 Allocate a pseudo-TTY

-u, --user=                     Username or UID (format: <name|uid>[:<group|gid>])

-v, --volume=[]                 Bind mount a volume

--volumes-from=[]               Mount volumes from the specified container(s)

-w, --workdir=                  Working directory inside the container



### create 

create a new container **but does not run it**

### ps

list containers

`-a`: show all containers(default show just running)

`-q`: only display numeric IDs

`-l`: show the latest created container, include non-running. 

`-n=`: show n last created containers, include non-running.

### stop 

stop a running container by sending SIGTERM and then SIGKILL after a grace period

### start 

start one or more stopped containers. 

`-i`: attach container's STDIN

`-a`: attach STDOUT/STDERR and forward signals.

### rm 

remove one or more containers,

`-f`: force the removal of a running container(SIGKILL)

<code>$ docker rm \`docker ps -a -q\`</code> 刪除所有的container

### logs

fetchs the logs of the container, 看看container裏面發生了什麼, 

`-f`: follow log output, 

`-t`: show timestamps

### top

display the running processes of a container 

```
$ docker stats daemon_dave 
CONTAINER           CPU %               MEM USAGE/LIMIT     MEM %               NET I/O
daemon_dave         0.09%               2.707 MB/4.02 GB    0.07%               10.52 kB/828 B
```

### stats

display a live stream of one or more containers' resource usage statistics(統計)

```
$ docker top daemon_dave 
UID                 PID                 PPID                C                   STIME               TTY                 TIME                CMD
root                8173                2361                0                   20:41               ?                   00:00:00            /bin/sh -c while true;do echo hello world;sleep 1;done
root                9971                8173                0                   20:44               ?                   00:00:00            sleep 1
```

### attach

Attach(**connect**) to a running container. --> to view its ongoing output or to control it interactively. `CTRL-p`, `CTRL-q`: detach, `CTRL-c` will send SIGKILL to the container.

在使用`$ docker run -d`或是`$ docker start`後, 有些時候要進入container操作, 那就可用`$ docker attach`

### exec

在我們的container裏面執行額外的processes (run a command in a running container),

`-d`: detached mode(run command in the background) 

利用`docker exec` 做維護, monitoring 或是 management tasks.

### inspect 

Return low-level information on a container or image


