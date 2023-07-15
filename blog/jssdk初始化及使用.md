# jssdk

jssdk会被用在网页中，在微信下（微信内置浏览器和公众号），可以直接调用微信的一些接口，如调用分享接口、调用相册窗口、获取地理信息等。

在小程序下可以实现网页与小程序的交互，传递消息等。

## 使用步骤

[参考](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#0)

1. 网页授权域名；

2. 测试/开发环境的使用/[本地调试](https://juejin.cn/post/6949067738526515237)；

3. 正常情况下，jsapi_ticket 的有效期为 7200 秒，通过 access_token 来获取。

## server 端的操作

1. [获取 access_token](https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html)；
   1. access_token 的有效期目前为 2 个小时，也就是说要有更新机制；
      1. 这边都走被动刷新的机制；
   2. access_token 的有效期通过返回的 expires_in 来传达；
   3. 公众号和小程序均可以使用 AppID 和 AppSecret 调用本接口来获取 access_token。
      1. [midway 发送请求](https://midwayjs.org/docs/extensions/axios)；
2. 获取 access_token，后去请求 ticket；
   1. 以上的 access_token 和 ticket，都有获取限制，所以，最好是存储到数据库，如果过期了，重新去获取，否则就使用数据库中的，根据请求去更新；
3. 然后使用 ticket 生成签名，这里有多个参数，要注意：
   1. timestamp：时间戳，需要是秒的时间戳，而不是毫秒；
   2. nonceStr，随机字符串，没什么要求，使用生成 id 的算法也是可以的；
      1. 但是这里要注意，后端加密的时候都是小写，不是驼峰，但是到前端初始化的时候，用的是驼峰的方式的；
   3. jsapi_ticket，获取的时候，返回的是 ticket，但是拼装字符串的时候，用的是 jsapi_ticket；
   4. url，**这里的 url，需要 jssdk 中的白名单的**，如果不是，就需要去放服务器上的校验文件，然后本地开发的时候，做一个映射，如 127.0.0.1 => test.jima101.com；
4. 这个时候，就可以去初始化了 wx.init；
   1. 要注意，**如果小程序/公众号，没认证，部分方法不能使用**，比如分享的方法就不可以使用，所以这些都需要保证；
5. 这里创建数据库表 wx_app_config，来保存公众号或者小程序的 appid 和 appsecret，access_token 等；

## [通过微信的sdk实现微信授权登录](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html)

具体操作可以参考`npm-package/uniapp-ui/components/jm-wx-mp-login`；

核心的逻辑流程：

1. 前端调用wx.login，获取code；
2. 拿到code，发给后端，后端调用微信服务器，获取openid和session_key；
3. 后端转换成自身的登录体系，返回给前端登录认证信息；
   1. 通常做成一个app下的openid和用户id进行对应的形式；
4. 后续正常发起已授权的请求；
5. 其他的相关授权信息，可以查阅相关接口，使用方法类似；

### [微信签名算法](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#62)

1. jsapi_ticket 是公众号用于调用微信 JS 接口的临时票据。
   1. 有效期 7200 秒；
   2. 开发者必须在自己的服务全局缓存 access_token；
2. 签名用的 noncestr 和 timestamp 必须与 wx.config 中的 nonceStr 和 timestamp 相同。
3. 这里要注意设置的白名单的问题，本地开发的时候，会随着 ip 的改变而改变；
4. redis 可以设置过期时间，过期了就自动删除了，很方便，不需要自己去控制；

## QA，一些常见的问题

### invalid ip 115.227.203.48 ipv6 ::ffff:115.227.203.48, not in whitelist rid: 63aa9234-321a2106-1db9233e'

当前请求的字段没有添加到白名单。

这里添加到白名单列表后，但是后续变化了，还需要添加过去。

### the permission value is offline verifying

还是上边配置的问题。

### config:fail,invalid url domain

当前页面的访问地址不对，需要做一层代理。

jima101.com => localhost

设置与开发 => 公众号设置 => 功能设置 => js 安全域名

127.0.0.1 test.jima101.com
