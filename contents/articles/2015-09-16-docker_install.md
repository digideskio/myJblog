# [Docker] linux安裝

[linux下安裝docker步驟](http://docs.docker.com/linux/step_one/):

```
$ sudo wget -qO- https://get.docker.com/ | sh
$ sudo status docker 
docker start/running, process 2312
$ sudo stop docker
docker stop/waiting
$ sudo start docker
docker start/running, process 14196
$ sudo docker info
```

升級docker: 

```
$ curl -sSL https://get.docker.com/ | sh
```

## use docker without sudo

不用sudo執行docker會出現: 

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

