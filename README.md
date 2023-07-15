# wechat-learn

wechat-learn 微信小程序开发

可以开发一个学习开发使用的英语的网站。可以查看常用的文档

## 小程序前端系统开发

## 小程序后端接口开发

## 类型

1. WeChat Official Accounts
2. h5
3. WeChat Mini Program
4. uni-app

## 各种 id

1. [unionID，用户 id](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/union-id.html)：**如果开发者拥有多个移动应用、网站应用、和公众帐号（包括小程序），可通过 UnionID 来区分用户的唯一性**，因为只要是同一个微信开放平台帐号下的移动应用、网站应用和公众帐号（包括小程序），用户的 UnionID 是唯一的。换句话说，同一用户，对同一个微信开放平台下的不同应用，UnionID 是相同的。
   1. **如果开发者帐号下存在同主体的公众号，并且该用户已经关注了该公众号**。开发者可以直接通过 wx.login + code2Session 获取到该用户 UnionID，无须用户再次授权。
   2. [wx.getUserInfo(Object object)](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html)
2. **OpenID 是公众号的普通用户的一个唯一的标识**，**只针对当前的公众号有效**。
   1. OpenID：为了识别用户，**每个用户针对每个公众号或小程序等应用会产生一个安全的 OpenID**，公众号或应用可将此 ID 进行存储，便于用户下次登录时辨识其身份，或将其与用户在第三方应用中的原有账号进行绑定
   2. **UnionId:UnionId 也是用户的标识符**，但它与 OpenID 不同的是，同一个微信用户，登录同一个开发主体下的多个小程序或公众号的时候，分配的 UnionId 是一样的。
3. **appId**，公众号/小程序的应用的标识；
