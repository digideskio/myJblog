# [Docker]  Dockerfile

[Official Dockerfile doc](https://docs.docker.com/reference/builder/)


## More

[building minimal docker containers for Go applications](https://blog.codeship.com/building-minimal-docker-containers-for-go-applications/)

[如何寫dockerfile](http://blog.tutum.co/2014/10/22/how-to-optimize-your-dockerfile/)

Go + docker + mongodb

Go + docker 測試

Go binary + docker


## install 

[linux下安裝docker步驟](http://docs.docker.com/linux/step_one/)

升級docker: 

```
$ curl -sSL https://get.docker.com/ | sh
```


## use docker without sudo

預設不用sudo執行docker當出現: 

```
Post http:///var/run/docker.sock/v1.19/containers/create: dial unix /var/run/docker.sock: permission denied. Are you trying to connect to a TLS-enabled daemon without TLS?
```

[docker doc 說明](https://docs.docker.com/installation/ubuntulinux/#giving-non-root-access)：

> The docker daemon binds to a Unix socket instead of a TCP port. By default that Unix socket is owned by the user root and other users can access it with sudo. For this reason, docker daemon always runs as the root user.

[how can i use docker without sudo](http://askubuntu.com/questions/477551/how-can-i-use-docker-without-sudo)

解決方法就是建立一個`docker` Unix group, 並且把我們的user加到這個docker group去 (注意 `docker` group 相當於 `root` group), 假設我的username叫作`ubuntu`: 

```
$ sudo usermod -aG docker ubuntu
```


## Usage 

![use](http://docs.docker.com/tutimg/container_explainer.png)

`run`: creates and runs a Docker container 

`hello-world`: image to load into the container

執行這個命名, Docker會去找我們有無`hello-world`這個image, 若沒有,就從Docker hub下載, 再來載入該image到container中並且執行

 though, is capable of much more. An image can start software as complex as a database, wait for you (or someone else) to add data, store the data for later use, and then wait for the next person.

你不用擔心你是否可以執行在Dockert image的程式, Docker container會幫你執行

[https://hub.docker.com/](https://hub.docker.com/)

`$ docker images`會列出現有images

## Build your own image

可以改變現有image, --> `Dockerfile`

Dockerfile告訴軟體使用哪種環境,或是執行哪個命令

```
FROM docker/whalesay:latest
```

`FROM`告訴Docker你要建立的image是基於哪個image

```
RUN apt-get -y update && apt-get install -y fortunes
```

執行安裝`fortunes`這個程式

一旦我們要裝的程式完成, 我們要下指令說當image被載入的時候就要執行這個程式: 

```
CMD /usr/games/fortune -a | cosway
```

利用Dockerfile把你的image的成份與行為都描述完後, 就可以build image: 

```
$ docker build -t docker-whale .
```

## Docker hub 

要push image上去前, 要先`$ docker login`


移除image: `$ docker rmi -f  imageID`

pull image: `$ docker pull yourname/docker-whale`


## More

[Official Docker user guide](http://docs.docker.com/userguide/)
