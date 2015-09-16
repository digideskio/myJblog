# [Docker]  自己整理

## 如何看docker commit message? 

`docker inspect simple_flask:v1 | grep "Comment"`

## 如何檢查 Dockerfile錯誤

## build caching 

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


這裡有很好的說明, 從現有container製作新的image: [docker-jump-start](http://odewahn.github.io/docker-jumpstart/example.html)

`$ docker commit -m <imgageID> <imgageName>`, `-m`: add a commit message explaining our new image, `-a`: list the author of the image.

沒有指定imageName, 這時候`$ docker images`會發現我們建立的image的REPOSITORY和TAG都是<none>, 

利用`$ docker tag`來指定名字: Tag an image into a repository

> Usage:  docker tag [OPTIONS] IMAGE[:TAG] [REGISTRYHOST/][USERNAME/]NAME[:TAG]

建議使用Dockerfile, 

撰寫好Dockerfile後, `$ docker build -t <tagName> <PATH>`, `-f`: `/path/to/file`

DockerFile也可以從Git repository上面指定, 例如: 

```
$ docker build -t "parks/static_web:v1" \
git@github.com:parks/docker_static_Web
```



`$ docker rmi`: remove one or more images



------------

[Official Docker doc: Get started with containers](https://docs.docker.com/articles/basics/)

```
$ docker info
$ docker pull ubuntu
$ docker -i -t ubuntu /bin/bash
```



[Official - Get started with images](https://docs.docker.com/userguide/dockerimages/)

`$ docker search sinatra`

`$ docker tag 5db5f8471261 ouruser/sinatra:devel`



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


## Docker hub 

要push image上去前, 要先`$ docker login`


移除image: `$ docker rmi -f  imageID`

pull image: `$ docker pull yourname/docker-whale`


## More

[Official Docker user guide](http://docs.docker.com/userguide/)

[Docker Cheat Sheet](https://github.com/wsargent/docker-cheat-sheet)

[15 quick docker tips](https://labs.ctl.io/15-quick-docker-tips/)

[10 docker tips and tricks](http://nathanleclaire.com/blog/2014/07/12/10-docker-tips-and-tricks-that-will-make-you-sing-a-whale-song-of-joy/)

[docker bash functions and aliases](http://kartar.net/2014/03/useful-docker-bash-functions-and-aliases/)
