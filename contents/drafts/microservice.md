# [Microservices] Introduction

局部整理與翻譯自: [an introduction to microservice- part 1](https://auth0.com/blog/2015/09/04/an-introduction-to-microservices-part-1)

A microservice is an isolated, loosely-coupled unit of development that works on a single concern. 

This is similar to the old "Unix" way of doing things: do one thing, and do it well. 


Matters such as how to "combine" whatever is provided by the service are left to higher layers or to policy. 

This usually means that microservices tend to avoid interdependencies: 

if one microservice has a hard requirement for other microservices, then you should ask yourself if it makes sense to make them all part of the same unit.

![microservice](http://imgur.com/qyRWBOKl.png)


Code quality and readability

What makes microservices particularly attractive to development teams is their independence. Teams can work on a problem or group of problems on their own. 

This creates several attractive qualities favored by many developers:

- Freedom to pick the right tool
- Quick iteration: microservices tend to be small, changes can be implemented relatively quickly.
- Rewrites are a possibility
- Code quality and readability


## More 

[完整microservice討論與說明](http://martinfowler.com/articles/microservices.html)

[REST microservices in Go with Gin](http://txt.fliglio.com/2014/07/restful-microservices-in-go-with-gin/)
