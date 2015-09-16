# [Docker] Using Docker to test a static website

from the Docker book


```
$ docker run -d -p 80 --name website \
-v $PWD/webiste:/var/www/html/website \
jamtur01/nginx nginx
```

裏面的`-v `option 關於 **volumne**:


Volumnes are specially designated directories withinb one or more containers that bypass the layered Union File System to provide persistent or shared data for Docker. 

This means that changes to a volumne are made directly and bypass the images. 

They will not be included when we commit or build an image.



每個Docker container 都被付與一個IP address


container名字是unique的, 不然就要docker rm 後在命名一樣的

## Linking Docker containers 
