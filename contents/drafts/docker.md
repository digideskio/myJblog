# [Docker]  自己整理

## 如何看docker commit message? 

`docker inspect simple_flask:v1 | grep "Comment"`

## 如何檢查 Dockerfile錯誤

`docker build`就會出錯, 這時候也會建立一個image. 我們利用這個image來建立一個container, 在裏面下出錯的指令來察看哪裡有問題, ok了再回來修改Dockerfile

## build caching 

Docker 本身在build image的時候會做cache, 例如Step 1~3都一樣, step4 出錯, 那Docker會保留step 1~3的cache, 從step4開始做, 若改了step1~3, 那就會從第一個指令重新開始

**Sometimes, though, you want to make sure you don't use the cache.**

**For example, if you'd cached Step 3 above, apt-get update , then it wouldn't refresh the APT package cache.**

那使用`docker build --no-cache`

或是： 

https://github.com/docker/docker/issues/3313

Dockerfile可寫如下：

```
FROM ubuntu:14.04
MAINTAINER lu-cho-ching
ENV LAST_UPDATED 2015-09-16
RUN apt-get -qq update
```

如果要更新cache, 只要改動 LAST_UPDATED, 下面的所有指令都會重新更新cache了! 


## compile your app inside the Docker container

---------------

# The Docker Book

## Docker架構

![arch](http://imgur.com/dOqRTQ5l.png)

Docker是 client-server 架構, Docker client 跟 Docker server或是daemon溝通 

which, in turn, does all the work. 

Docker ships with a command line client binary `docker`, as well as a full RESTful API.

我們可以執行docker damemon和client在同一個host, 或是將你local Docker client 連線到remote daemon或是其他host.

### docker images

Images are the building blocks of the Docker world.

You can launch your containers from images.

Images are the "build" part of Docker's life cycle, 

They are a layered format, using Union file systems, that are built step-by-step using a series of instructions.

**You can consider images to be the source code for your containers**

### Registries

Docker stores the images you build in registries.

有public registry: Docker Hub


## Working with Docker images and repositories

docker filesystem layers: 

![filesystem](http://imgur.com/OHlrunul.png)

**build images and run containers with our applications and services**

察看在我們的Docker host有哪些images可用`$ docker images`

`$ docker search puppet`

**puppet使用**


### what is a Docker image? 

A Docker image is made up of filesystems layered over each other.

At tha base is a boot filesystem, bootfs, which resembles the typical Linux/Unix boot filesytem. 使用者幾乎不會跟boot filesystem有互動行為

When a container has booted, it is moved into memory, and the boot filesystem is unmounted to free up the RAM used by the initrd disk image. 

... (還有很多)

### commands 

#### images 

list images 

### search 

Search the Dockerhub for images

#### pull

`$ docker pull ubuntu:12.04` --> pull down the ubuntu 12.04 image from the ubuntu repository


### Building our own images 

兩種方法: 

1. `$ docker commit` (不建議)
2. `$ docker build` + `Dockerfile`

事實上我們不是建立一個全新的image, 而是基於現有的base image來build一個image

要使用Docker Hub, 要`$ docker login`: 這會登入Docker Hub並且儲存我們的憑證給接下來使用,`$ docker logout`登出


`$ docker commit -m <imgageID> <imgageName>`, `-m`: add a commit message explaining our new image, `-a`: list the author of the image.

例如: 

```
$ docker commit -m 'A new custom image' -a 'James Wall' 4aab3ce3cb76 jamtur01/apache2:webserver
```

沒有指定imageName, 這時候`$ docker images`會發現我們建立的image的REPOSITORY和TAG都是<none>, 

利用`$ docker tag`來指定名字: Tag an image into a repository

> Usage:  docker tag [OPTIONS] IMAGE[:TAG] [REGISTRYHOST/][USERNAME/]NAME[:TAG]


`$ docker rmi`: remove one or more images

#### docker build 

> docker build [OPTIONS] PATH | URL | -

Build a new image from the source code at PATH

`-f, --file=`                     Name of the Dockerfile (Default is 'PATH/Dockerfile')

`--force-rm=false`                Always remove intermediate containers

`--no-cache=false`                Do not use cache when building the image

`--rm=true`                       Remove intermediate containers after a successful build

`-t, --tag=`                      Repository name (and optionally a tag) for the image

build途中有失敗的話, 一樣可以用build到目前狀態的image來做container, 然後進去測試, ok了在重新run build

#### docker run -d -p 80

`-P, --publish-all=false`         Publish all exposed ports to random ports

`-p, --publish=[]`                Publish a container's port(s) to the host

`-p` flag manages which network ports Docker publishes at runtime.

當我們run一個container, Docker有兩種在Docker host上分配ports的方法:

  - 隨機指定Docker host的port number從32768到61000, 用來mapping在container上的port 80
  - 我們親自指定Docker host的port number來mapping在container上的port 80
  
The `docker run` will open a random port on the Docker host that will connect to port 80 on the Docker container.

用`docker ps -l`察看, 或是用 `docker port <imageID> <portNumber>`察看

要指定port號像這樣 --> `docker run -d -p 8080:80`, 這樣就會綁定localhost的port 8080到container的port 80

或是`docker run -d -p 127.0.0.1:80:80`


#### EXPOSE 

```
EXPOSE 80
```

`EXPOSE` tells Docker that the application in this container will use the specific port on the container.

安全性上考量, Docker不會自動開啟`EXPOSE`的port, 而會等到你用`docker run`的時候指定開啟

docker 也利用 EXPOSE 來連接其他container.  run time的時候也可以指定, 使用`--expose`

#### CMD 

當container跑起來的時候才會執行`CMD`

建議還是用array方式避免非預期行為: `CMD ["/bin/sh", "-i"]`

在`docker run`指定cmd, 就會覆寫 CMD的行為

注意`ENTRYPOINT` 和 `CMD` 的交互方式! 

一個Dockerfile只能指定一個CMD, **如果一個container起始要跑多個processes, 建議用service management tool像是 Supervisor**.

#### ENTRYPOINT + CMD

CMD看來很容易被覆寫,  `ENTRYPOINT`提供比較不容易覆寫的command. 

`ENTRYPOINT ['/usr/sbin/nginx']`

`docker run -d -P jamtur01/static_web -g "daemon off;"` 後面參數就會被加到ENTRYPOINT去, 變成執行`/usr/sbin/ngin -g "daemon off;"`

CMD變成預設參數, 如果docker run沒有任何參數, 那預設一定會跑CMD, 若有就覆寫

```
ENTRYPOINT ['/usr/sbin/nginx']
CMD ['-h']
```

#### WORKDIR

provide a way to set the working directory for the container and the ENTRYPOINT and/or CMD to be executed when a container is launched from the image.

```
WORKDIR /opt/webapp/db 
RUN bundle install 
WORKDIR /opt/webapp 
ENTRYPOINT [ "rackup" ]
```

我們改到 /opt/webapp/db目錄來跑 bundle install, 再切換到 /opt/webapp目錄指定我們的ENTRYPOINT

runtime的時候用`-w`覆寫

#### VOLUME

- Volumne can be shared and reused between containers.
- A container doesn't have to be running to share its volumnes
- Changes to a volumne are made directly
- Changes to a volumne will not be included when you update an image.
- Volumne persist until no containers use them.

這樣可以讓我們增加資料(例如source code), 資料庫或是其他內容到image去, 而不用把這些內容commit到image, 並且可以讓我們在containers之間共享資料

```
VOLUME ["/opt/project"]
```

**將會建立一個/opt/project的 mount point給任何從這個image建立的containers**.

也可以像是 `VOLUME [ "/opt/project" , "/data" ]`


#### ADD 

add files and directories from our build environment into our image.

`ADD <source> <destination>` 

`ADD software.lic /opt/application/software.lic`

This ADD instruction will copy the file software.lic from the build directory to /opt/application/software.lic in the image.

**不能從build directory外面ADD檔案**

**注意有沒有加/, 有加表示為目錄, 沒加表示為檔案**

如果 destination 不存在, Docker會建立完整的路徑與檔案(mode: 0755, UID,GID都是0)

#### ONBUILD

add triggers to image.

A trigger is executed when the image is used as the basis of another image.

(e.g., if you have an image that needs source code added from a specific location that might not yet be available, or if you need to execute a build script that is specific to the environment in which the image is built).

就是很方便來製作 template image使用

## Docker hub 

要push image上去前, 要先`$ docker login`

pull image: `$ docker pull yourname/docker-whale`


(more) 也支持 automate build (也叫trusted build) 靠著連線github或是bitbuckets


## More

docker 可以透過vncserver 操作GUI介面! (例如xfce4)

[docker jump start](http://odewahn.github.io/docker-jumpstart/example.html)

[Official Dockerfile best practices](https://docs.docker.com/articles/dockerfile_best-practices/)

[initial shell script and run shell script.](https://gist.github.com/kvzhuang/8233907)

[building minimal docker containers for Go applications](https://blog.codeship.com/building-minimal-docker-containers-for-go-applications/)

[如何寫dockerfile](http://blog.tutum.co/2014/10/22/how-to-optimize-your-dockerfile/)

Go + docker + mongodb

Go + docker 測試

Go binary + docker

[docker-jump-start](http://odewahn.github.io/docker-jumpstart/example.html)

[Official Docker user guide](http://docs.docker.com/userguide/)

[Docker Cheat Sheet](https://github.com/wsargent/docker-cheat-sheet)

[15 quick docker tips](https://labs.ctl.io/15-quick-docker-tips/)

[10 docker tips and tricks](http://nathanleclaire.com/blog/2014/07/12/10-docker-tips-and-tricks-that-will-make-you-sing-a-whale-song-of-joy/)

[docker bash functions and aliases](http://kartar.net/2014/03/useful-docker-bash-functions-and-aliases/)
