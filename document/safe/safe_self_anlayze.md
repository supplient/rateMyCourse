服务器的资源包括
1. 内存
2. 带宽
3. 硬盘
4. CPU

以下内容全部标记为[!]

# 内存
对内存的攻击，我想象中就只有耗尽内存了。要是攻击者能通过定位内存地址窃取信息，那也太NB了，我认输……

为了耗尽内存，设想的攻击方式：建立复数个链接，同时请求危险接口，而危险接口会从数据库中读取大批量的数据。过多的数据同时被读入内存，导致内存被耗尽。

事实上就算没有遭受攻击，这样的偶发情况也可能发生。我不确定数据库的读取是否存在一个多连接共享的缓冲区。

危险接口：
* searchTeacher
* searchCourse
* searchUser
* searchCourseByDepartment
* getDepartment
* getCommentsByCourse
* getAllRank


# 带宽
对带宽的攻击，我觉得也只有耗尽带宽，也就是涌入/涌出过多请求，占据了所有带宽。对于涌入，基本和dos攻击同义，这在前文已经叙述过了。所以这里只考虑涌出。

攻击方式：建立复数个链接，每个连接都向服务器发送一个请求，而这个请求会引来大量数据的回复。

就算前文中的内存处，数据库存在缓冲，前文的攻击方式依然会导致带宽的耗尽。

危险接口同内存部分。


# 硬盘
我们在硬盘部分的存储包括：
* 运行日志
* 用户上传文件
* 数据库

## 运行日志
[?]这部分还有待挖掘，我不确定是否存在低流量但却会导致大量的日志的攻击方式。或者是否存在窃取运行日志的手段。

## 用户上传文件
目前我们不存在用户上传文件，但以后可能存在。

* 耗尽危险：我们需要为每个用户设置一个上传文件大小的上限，就是说任何存放在服务器端的用户上传文件都要能定位到一个用户，然后这个用户名下的所有文件的大小加起来不能超过这个上限。
* 注入危险：在前文中也提到了，可能会有伪装成png的html文件。
* 泄露危险：有些用户上传文件是用户敏感的。所以我们需要给这些敏感文件设置访问权限，避免泄露。
* 篡改风险

## 数据库
### 耗尽危险
攻击方式：不停请求接口，创建大量无用模型。

这部分无法完全从代码层解决，考虑刷评论的水军这样的存在，我们无法从代码层级上限制“人”来创建无用模型，这只能由管理员来限制这些“人”的行为。所以我们能做的，只有限制“非人”创造无用模型。

危险接口：
* addTeacher
* addCourse
* makeComment

### 注入危险
攻击方式：通过上传一些注入代码，在客户端/服务器端执行这些注入代码。

注入方式有很多种，对于我们的服务器，我只能想象到SQL注入和XSS攻击。而前者，如前文所述，对于django而言基本可以忽略。

而XSS攻击，如前文所述浏览器已经自己支持了，可能并不需要我们亲手去进行防卫构筑，但还是列一下，基本上存在用户上传字符串，而且这些字符串会被渲染到页面上的都可以被利用于XSS攻击。

危险接口：
* signIn
* updateUser
* addTeacher
* addCourse
* makeComment
* editComment

### 泄漏风险 & 篡改风险
攻击方式：访问修改该用户不应具有权限访问的内容。

危险接口：
* addTeacher
* addCourse
* addTeachCourse


# CPU
我们似乎不需要考虑这个问题，因为不存在可能导致大量计算的服务，也不存在可能导致死循环的接口。