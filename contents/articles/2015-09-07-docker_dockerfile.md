# [Docker]  Dockerfile reference

以下局部翻譯與整理自 [Official Dockerfile doc](https://docs.docker.com/reference/builder/)

## Usage 

The `docker build` command builds an image from a `Dockerfile` and a `context`. The build’s context is the files at a specified location PATH or URL.  `PATH` is a directory on your local directory, `URL` is a the location of a Git repository.

```
$ docker build .
Sending build context to Docker daemon  6.51 MB
...
```

`.dockerignore`排除掉不必要build的檔案或是目錄

You can specify a repository and tag at which to save the new image if the build succeeds:

```
$ docker build -t shykes/myapp .
```

build完, 就可以考慮pushing a respository to its registry.

## Format

```
# Comment
INSTRUCTION arguments
```

第1行一定要是`FROM` 指定base image

## Environment replacement

Environment variables(declared with the `ENV` statement) can alse by used in certain instructions as variables to interpreted

`$variable_name` 或 `${variable_name}`(用在像是 `${foo}_bar`)

`${variable_name}`支援一些bash modifiers: 

- `${variable:~word}` 如果`variable`被設置,那結果就是這個`variable`的值, 如果沒有設置, 那`word`就是結果的值
- `${variable:+word}` 如果`variable`有設置, 那`word`就是結果的值, 不然為空字串

以下指令負責處理environment variables: 

- `ENV`
- `ADD`
- `COPY`
- `WORKDIR`
- `EXPOSE`
- `VOLUME`
- `USER`

**注意**

```
ENV abc=hello
ENV abc=bye def=$abc
ENV ghi=$abc
```

`def`為`hello`(因為abc=bye當作是同行命令的一部份), `ghi`為bye

## .dockerignore

```
*/temp*
*/*/temp*
temp?
*.md
!LICENSE.md
```

`temp?`: Exclude the files that match the pattern in the root directory. For example, the files tempa, tempb in the root directory are ignored.

## FROM 

```
FROM <image>
FROM <image>:<tag>
FROM <imaage>@<digest>
```

`FROM`可以多次出現用來建立多個images,  預設是`latest`

## RUN

The RUN instruction will execute any commands in a new layer on top of the current image and commit the results. The resulting committed image will be used for the next step in the Dockerfile.

兩種型式: 

- shell form: `RUN <command>`: `bash /bin/sh -c` (launch bash and execute the <command>)

- exec form: `RUN ["executable", "param1", "param2"]`


**Layering RUN instructions and generating commits conforms to the core concepts of Docker where commits are cheap and containers can be created from any point in an image’s history, much like source control.**

exec form 避免shell string munging(改寫), 而且讓`RUN`指令使用base image而不用包含`/bin/sh`

**注意** 使用不同的shell例如: `RUN ["/bin/bash", "-c", "echo hello"]`, 只能使用雙引號

**注意** exec form裡`RUN [ "echo", "$HOME" ]`無法執行變數取代, 只能用像: `RUN [ "sh", "-c", "echo", "$HOME" ]`才行! 

`docker build --no-cache`

[stackoverflow- what is /bin/sh -c](http://stackoverflow.com/questions/3985193/what-is-bin-sh-c)

## CMD 

`CMD`的主要目的, 就是提供一個可執行的continer預設的執行指令

- exec form: `CMD ["executable","param1","param2"]` 建議用這
- `CMD ["param1","param2"]` 為`ENTRYPOINT`預設參數
- shell form: `CMD command param1 param2`

Dokcerfile只能有一個CMD指令

通常`CMD`會跟`ENTRYPOINT`合用, 用來提供預設的參數給`ENTRYPOINT`

```
FROM ubuntu
CMD ["/usr/bin/wc","--help"]
```

if you would like your container to run the same executable every time, then you should consider using ENTRYPOINT in combination with CMD. 

**注意CMD和RUN的區別**: `RUN`會實際執行command, 並且把結果commit。`CMD`在build time的時候不會執行任何事情

## LABEL

用來加入些metadata給這個image: 

```
LABEL <key>=<value> <key>=<value> <key>=<value> ...
```

例如:

```
LABEL com.example.label-with-value="foo"
LABEL version="1.0"
LABEL description="This text illustrates \
that label-values can span multiple lines."
```

**Docker建議儘可能把labels都放在一個LABEL命令下**, 因為每個LABEL都會產生一個新的layer, 導致最後產生的image沒有效率, 最好是像這樣: 

```
LABEL multi.label1="value1" multi.label2="value2" other="value3"
```

要察看該image有哪些labels, 使用`docker inspect` command, 察看其`Labels`屬性值

## EXPOSE

The `EXPOSE` instruction informs Docker that the container will listen on the specified network ports at runtime.

```
EXPOSE <port> [<port>...]
```

 EXPOSE doesn’t define which ports can be exposed to the host or make ports accessible from the host by default. To expose ports to the host, at runtime, use the -p flag or the -P flag.

## ENV

```
ENV <key> <value>
ENV <key>=<value> ...
```

例如: 

```
ENV myName="John Doe" myDog=Rex\ The\ Dog \
    myCat=fluffy
```

利用 `docker inspect`檢查, 利用`docker run --env <key>=<value>`做修改

**Note** To set a value for a single command, use `RUN <key>=<value> <command>`.

## ADD

The `ADD` instruction copies new files , directories, or remote file URLs from <src>,  and adds them to the filesystem of the container at the path <dest>.


兩種型式: 

- `ADD <src>.. <dest>`
- `ADD ["<src>",..."<dest>"]`:  (this form is required for paths containing whitespace)

例如: 

```
ADD hom* /mydir/        # adds all files starting with "hom"
ADD hom?.txt /mydir/    # ? is replaced with any single character
```

**The <dest> is an absolute path, or a path relative to WORKDIR**: 

```
ADD test aDir/          # adds "test" to `WORKDIR`/aDir/
```

In the case where <src> is a remote file URL, the destination will have permissions of 600.

若沒有權限, 需要用`RUN wget`或是`RUN curl`來取代`ADD`

有很多copy的注意規則, 直接看[官方說明](https://docs.docker.com/reference/builder/#cmd)

## COPY

**跟ADD一樣, 但是沒有辦法處理tar, 和url**  (ADD可以做比較多事情)

** "For other items (files, directories) that do not require ADD’s tar auto-extraction capability, you should always use COPY."**

兩種型式: 

- `COPY <src>... <dest>`
- `COPY ["<src>",... "<dest>"]` (this form is required for paths containing whitespace)

例如: 

```
COPY hom* /mydir/        # adds all files starting with "hom"
COPY hom?.txt /mydir/    # ? is replaced with any single character
```

## VOLUME

```
VOLUME ["/data"]
```

[the definition of volume](https://en.wikipedia.org/wiki/Volume_(computing): In the context of computer operating systems, a volume or logical drive is a single accessible storage area with a single file system, typically (though not necessarily) resident on a single partition of a hard disk.

```
FROM ubuntu
RUN mkdir /myvol
RUN echo "hello world" > /myvol/greeting
VOLUME /myvol
```

以上Dockerfile經由`docker run`, 會建立一個image, 建立一個新的`/myvol`的mount point, 並且將`greeting`檔案拷貝到我們新建的volumne.

**若在volumne的資料在宣告volumen之後被改變, 這些改變會被捨棄**

## USER 

```
USER daemon
```

The `USER` instruction sets the user name or UID to use when running the image and for any `RUN`, `CMD`, `ENTRYPOINT` instructions that follow it in the Dockerfile.

## WORKDIR

```
WORKDIR /path/to/workdir
```


The WORKDIR instruction sets the working directory for any RUN, CMD, ENTRYPOINT, COPY and ADD instructions that follow it in the Dockerfile.

一個Dockerfile裏面可以呼叫多次來改變工作目錄: 

```
WORKDIR /a
WORKDIR b
WORKDIR c
RUN pwd
```

上例最後pwd結果為`/a/b/c`

`WORKDIR`也收之前宣告的`ENV`環境變數: 

```
ENV DIRPATH /path
WORKDIR $DIRPATH/$DIRNAME
```

## ENTRYPOINT

`ENTRYPOINT` 可以設定container為可執行

- exec form: `ENTRYPOINT ["executable", "param1", "param2"]` 建議
- shell form: `ENTRYPOINT command param1 param2`

例如以下, 啟動nginx及其預設內容,port 80: 

```
$ docker run -i -t --rm -p 80:80 nginx
```

`docker run <image>`後面的參數都會被加到所有exec form `ENTRYPOINT`的所有元素去, 並且會覆寫所有用`CMD`指定的元素

例如`docker run <image> -d`, 那`-d`參數都會pass給entry point,  可用`docker run --entrypoint`覆寫entrypoint


You can use the exec form of ENTRYPOINT to set fairly stable default commands and arguments and then use either form of CMD to set additional defaults that are more likely to be changed: 

```
FROM ubuntu
ENTRYPOINT ["top", "-b"]
CMD ["-c"]
```

例如: 

```
FROM debian:stable
RUN apt-get update && apt-get install -y --force-yes apache2
EXPOSE 80 443
VOLUME ["/var/www", "/var/log/apache2", "/etc/apache2"]
ENTRYPOINT ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
```

## ONBUILD

```
ONBUILD [INSTRUCTION]
```

當這個image被用來當作其他build的base的時候, `ONBUILD` 指令會在image裏面加一個 *trigger* 指令用來晚點執行

The trigger will be executed in the context of the downstream build, as if it had been inserted immediately after the FROM instruction in the downstream Dockerfile.

Any build instruction can be registered as a trigger.

當我們要建立一個image來build其他image的時候會很有用, 例如 an application build environment 或是 a daemon ,這些都可以被使用者客制化

例如, 我們的image是一個可重複使用的Python application builder, 那會需要一些application source code被加入到特定的目錄, 另外也可能會需要一個build script在之後被呼叫

這時候不能只用`ADD`或是`RUN`, 因為沒有存取application source code的權限, 並且每個apllication build都不會相同

我們可以提供開發者一個Dockerfile boilerplate讓開發者用來copy-paste到他們的app去, 不過這樣沒有效率, 容易發生錯誤而且難以更新因為這檔案混雜了特定的app相關的程式碼

解法就是利用`ONBUILD`註冊一些進一步的指令來晚些執行

工作原理: 

1. When it encounters an ONBUILD instruction, the builder adds a trigger to the metadata of the image being built. The instruction does not otherwise affect the current build.
2. At the end of the build, a list of all triggers is stored in the image manifest, under the key OnBuild. They can be inspected with the docker inspect command.
3. Later the image may be used as a base for a new build, using the FROM instruction. As part of processing the FROM instruction, the downstream builder looks for ONBUILD triggers, and executes them in the same order they were registered. If any of the triggers fail, the FROM instruction is aborted which in turn causes the build to fail. If all triggers succeed, the FROM instruction completes and the build continues as usual.
4. Triggers are cleared from the final image after being executed. In other words they are not inherited by “grand-children” builds.

```
[...]
ONBUILD ADD . /app/src
ONBUILD RUN /usr/local/bin/python-build --dir /app/src
[...]
```

