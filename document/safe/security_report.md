
# 安全性分析及性能对比

本报告主要分析可能的安全性问题的解决方式，以及改进后的安全性和性能对比

## DOS攻击

我们在现阶段使用了Cloudflare提供的免费CDN服务。
根据官网介绍，该套餐提供免费的无限流量DDoS防护。
历史上Cloudflare免费版的DDoS限额是5G，网友实际经历是免费版扛住了30G的攻击。

## CC攻击

目前我们采取的抵挡CC攻击的手段主要有以下几级：

* 利用Page Rule对部分链接的CDN缓存（免费版支持3条）
* 本地接口的cache功能
* 优化的数据库存取手段与高效的数据处理
* 前后端分离，将网页渲染从服务器端转到客户浏览器
* 限制同IP访问频率
* 加钱升级服务器

我们在夜深人静时对服务器做了小规模模拟攻击测试，测试结果请见，a href="https://www.cnblogs.com/tbqjxjkwg/p/10902833.html">beta阶段压力测试博客</a>。

## 篡改服务器端存放的文件

用户使用我们的服务可能留下的信息有：账号信息，评论信息（含点赞，评分），头像。
其中前两类存储在数据库中，用户恶意上传的难度较大。
对于用户头像，我们目前使用公共图床的形式保存，并没有保存在自己的服务器上。
这一方面降低了服务器的资源占用，另一方面规避了恶意上传非图片格式的攻击代码的风险。
目前，用户暂时不能在我们的服务器上创建文件。

## XSS攻击

XSS攻击也是目前常见的一种攻击形式，我们也对其进行了防范。

在后端，我们设置了SecurityMiddleware中间件，该中间件会自动设置http头，防护XSS攻击。
该中间件在默认Django项目中是关闭的，需要手动打开并进行简单配置。
此外，在数据库储存是我们也进行了转义与其他操作。

前端通过判断加载的内容来规避XSS攻击。

## CSRF攻击

Django自带了CSRF中间件并默认开启，然而去年的同学们却将其关闭了，有潜在的威胁。
现阶段我们除了重新打开CSRF中间件外，还实现网站前后端分离，不再利用Django的templates渲染网页在返回，而Django的渲染返回结果里CSRF token是明文的。

目前所有的POST方法都打开了CSRF验证，防止恶意访问。
注册页面还采用了验证码进行二次保护。

## SQL注入攻击

Django提供了完善的抽象模型防护SQL注入，这方面似乎并没有什么可担心的。
然而保险起见，我们对于访问数据中的一些关键字，如where，and，=等采取了一些手段做了手动防护。

## Clickjacking攻击

该问题较好解决。
后端将Django提供的默认关闭的中间件打开，前端通过Nginx添加Http头即可解决。

## SSL/HTTPS

显然，一个采用了HTTPS的网站看上去就比一个只支持HTTP的同类型网站专业的多。
去年的网站并没有HTTPS功能，而今年我们采取了完整的HTTPS支持。
在alpha阶段部署HTTPS后，我们在beta阶段做了如下改进：
* 强制HTTPS跳转，所有HTTP流量会被自动重定向。
* 支持TLS 1.3与HTTP 2
* 增强密钥强度
* DNS CAA
* 支持HSTS
* 支持IPv6 HTTPS

以下是两阶段的对比
![old.PNG](https://i.loli.net/2019/05/05/5ccdc8dccf0ba.png)
![new.PNG](https://i.loli.net/2019/05/05/5ccdc8dcd8346.png)

## 管理数据库的远程登录

数据库远程端口关闭，仅能从服务器上登陆。
数据库不使用root账号。
关键信息存储在环境变量中。

提醒一下友商关一下3306端口。

## 服务器资源风险

目前我们从以下几个方面做了服务器资源保护

### 内存

开启swap，目前服务器物理内存和swap分区共有5GiB。
服务在正常运行时的内存消耗约为200~400MiB，在上面压测时消耗约800MiB。

暂时没有明显的内存耗尽风险。

### CPU

目前我们使用的是薅资本主义羊毛搞的Vultr服务器。
利用学生账号还可以申请$50的Digital Ocean的优惠券以及一个免费域名。
目前配置2C@2600MHz，比华为云的服务器好一些，另外还有CDN保护，暂时没有太大问题。

### 带宽

薅来的服务器共享带宽1Tbps。
在压测时关CDN峰值达到400Mbps，余度较大，但是华为云是1M的小水管，这个峰值就爆带宽了。

### 硬盘与SQL

我们在服务器上不保存照片，并且对文字长度，访问频率都进行了较严格的限制，因此爆硬盘的风险较小。

SQL测试结果可以参考我们的技术博客。