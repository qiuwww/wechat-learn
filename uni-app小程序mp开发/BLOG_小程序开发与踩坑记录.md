# 微信小程序开发与踩坑记录

1. 大家业务可能需要 h5 嵌入到小程序中，以及设置分享等，以及一些注意点；
2. 个人的小程序的开发经验总结；

## 🖇 开发相关

### 1、使用 `web-view` 加载 h5 与设置当前页面的小程序分享

[web-view 文档](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html)

#### 小程序的 `web-view` 与一般的 iframe 异同

**相似的地方**：

1. 都用来加载在线的动态资源，如 html，pdf 之类的，`web-view` 是网页的原生载体，用于在原生环境中加载一个页面，iframe 是网页的 html 载体，用于在网页中加载一个新的动态资源。

**差异的地方**

1. 小程序内的 `web-view` 限制很严格：
   1. `web-view` 加载的 url 需要在后台配置域名白名单，包括内部再次 iframe 内嵌的其他 url；
      1. 小程序限制加载的资源都是 https 请求的，所以有时候出现加载不出来的问题，很可能就是接口或者页面地址有问题；
      2. 另外一个问题就是，进行真机测试的时候最好不要开**开发调试模式**，可能就会漏掉一些问题；
2. `web-view` 会自动铺满整个小程序页面，且默认展示到最上边一层，不能被覆盖；
3. 小程序端 `web-view` 组件一定有原生导航栏，下面一定是全屏的 `web-view` 组件，`navigationStyle: custom` 对 `web-view` 组件无效。
4. 小程序不能获取 `web-view` 对象，也就是内外完全隔离，不能通过获取组件引用来操作；
   1. 嵌入的 `web-view` 网页只能 `postMessage` 给小程序，且小程序只能在**特定时机（小程序后退、组件销毁、分享）触发并收到消息**。也就是说，消息不是实时的，会存储到一个数组中在以上时机一起被拿到，`web-view` 发送的消息会一直累加，这个数组长度一直变大；
   2. `bindload`，这个方法开发者工具无效，测试的时候发现，**只要地址格式正确就认为是成功了，就会被触发**，并不是页面加载完整才触发；
   3. `binderror`，这个方法开发者工具无效，**地址格式出错就认为加载失败**，真正没加载出来也不会触发；

#### `web-view` 加载 h5 页面

1. 需要在 url 获取到的时候再渲染`web-view`组件，否则可能出现空白页；

```html
<template>
  <view class="common-webview">
    <web-view v-if="url" class="web" :src="url" @message="onWebMessage" />
  </view>
</template>
```

2. `@message`接受页面发出的消息，需要内嵌小程序引入微信的 sdk，然后使用`wx.miniProgram.postMessage({ data: 'foo' })`来发消息；
3. `web-view`，内嵌 h5 需要打开小程序页面可以调用小程序的跳转方法进行跳转，这里注意 tab 页面只能使用`wx.miniProgram.switchTab`，来跳转。

```js
(window as any).wx.miniProgram.navigateTo({
  url: `/pages/common/webview?url=${encodeURIComponent(resolveH5Url)}`
});
```

#### `web-view`页面的分享设置

1. 最直观的方式，就是打开小程序页面的时候，同时传递分享的标题和图片，如下：
   1. 这样做主要是针对一些 **h5 代码不能修改的情况**，或者加载的一组 h5 页面分享的标题不改变的情况，对于需要不断切换分享内容的情况，是不能实现的；

```js
// 在h5中使用 wx.miniProgram.navigateTo
wx.navigateTo({
  url: `/pages/common/webview?url=${encodeURIComponent(jumpUrl)}&imageUrl=${imageUrl}&title=${title}`
});
```

2. 对于自己可控的 h5 页面，可以使用`postMessage`的方式，将需要分享的参数动态的发给小程序页面，这样让小程序页面通过当前的 url 来匹配这里的 message 对象，从而拿到分享的信息，具体操作如下：

```js
// h5操作
if (env.inWechatMiniProgram) {
  (window as any).wx.miniProgram.postMessage({
    data: {
      title: title || '', // 分享的title
      imageUrl: imageUrl || '', // 分享的展示图片
      pageUrl: window.location.href, // 当前页面的url，需要作为key来识别消息
    }
  });
}

// 小程序端
// 点击分享的时候，会调用两个函数，一个是onShareAppMessage，一个是onWebMessage（前）
// 接受postMsg的消息列表，进入页面或者点击操作的时候会发送消息，在小程序的分享按钮被点击的时候这里会被调用，调用在onShareAppMessage前
async onWebMessage({ detail: message }) {
  this.messageList = message.data || [];
}

// 点击分享按钮，当前函数会被调用
async onShareAppMessage(options = {}) {
  const { webViewUrl } = options;
  const searchCurOptions = this.messageList.reverse().find(item => item.pageUrl === webViewUrl) || {};
  console.log("这里就是当前分享的信息", searchCurOptions)
}
```

需要更多的配置，也是可以添加参数来实现的。

### 2、页面模式及标题栏返回

#### 页面模式

[页面开发模式](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html#%E9%85%8D%E7%BD%AE%E9%A1%B9)

可以通过设置 pages.json 中的页面的 navigationStyle 为 custom 来自定义导航栏。

1. default，不设置的默认模式，常规页面操作流程；
2. custom，自定义导航栏，通常用于首页展示或者自定义标题栏，但是对于`web-view`页面无效；

#### 标题栏的返回问题

由于小程序只会在小程序页面间跳转的时候，默认标题栏出现返回按钮，所以如果在 **tabbar 页面嵌入 h5**，h5 内部的跳转是不能出现返回按钮的，所以需要特殊处理：

1. 如果第一个打开的是一个内嵌 h5 的页面，则当前页面的跳转，**都需要调用小程序接口来进行跳转**；
2. 出现返回按钮之后的页面，则不需要使用了；

```js
wx.miniProgram.navigateTo({
  url: `/pages/common/webview?url=${encodeURIComponent(jumpUrl)}&imageUrl=${imageUrl}&title=${title}`
});
```

### 3、分包的问题

[微信小程序分包](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html)

#### 为什么需要分包

微信客户端在打开小程序之前，会把整个小程序的代码包下载到本地的，这种策略可以**缓解页面跳转时白屏的问题**。同时微信还对小程序代码包大小设置了 **2M** （最初只有 1M）的上限来确保小程序能有还不错的启动速度。

#### 分包应该注意的地方

1. 微信小程序每个分包的大小是 2M，总体积一共不能超过 20M；
2. 需要尽量保持主包只加载必须的内容，主要包括一些必须公共资源/JS 脚本，tabBar 页面，最好只包括这些页面；
3. **分包越早越好**，如果后期进行分包，不然后期进行分包，就要处理前期被内部及外部调用的地址；
   1. 对于已经对外放出的页面就更没法修改了；
   2. 页面不能通过路由进行重定向，也就是路由与页面位置是绝对对应的；
4. 主包不可以引用子包内容，**子包只可以引用自己包内和主包内的内容**，子包内不能嵌套子包；
   1. **独立分包是小程序中一种特殊类型的分包，可以独立于主包和其他分包运行**。从独立分包中页面进入小程序时，不需要下载主包。当用户进入普通分包或主包内页面时，主包才会被下载，这个我们通常不会用到。
5. **子包预下载**：开发者可以通过配置，在进入小程序某个页面时，由框架自动预下载可能需要的分包，提升进入后续分包页面时的启动速度。对于独立分包，也可以预下载主包。

### 4、小程序开发配置 condition

[uni-app 设置 condition](https://uniapp.dcloud.io/collocation/pages?id=condition)

> 启动模式配置，仅开发期间生效，用于模拟直达页面的场景，如：小程序转发后，用户点击所打开的页面。

可以在不必将要开发的页面每次写到 pages.json 的 pages 下的第一个，也可以保证小程序每次刷新的时候，选择的编译模式能用。

```json
{
  "condition": {
    "current": 0,
    "list": [
      {
        "name": "index",
        "path": "pages/index/index",
        "query": "isShowHelp=1"
      }
    ]
  }
}
```

### 5、小程序与 h5 及小程序之间的跳转的一些规则

1. 小程序的分享，只能是小程序打开；
2. 公众号的分享只能是公众号打开；
3. 小程序内通过`web-view`，可以打开 h5；
4. 小程序跳转小程序是没什么限制的，只要知道对方的 appid 以及跳转的目标页面就可以了，也可以设置跳转的是**体验版/开发版/正式版本**。
   1. 正式版本只能跳转正式版本；
5. h5 打开小程序，h5 需要引入微信的 sdk，设置调用的功能，然后通过[开放标签](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_Open_Tag.html#%E5%BC%80%E6%94%BE%E6%A0%87%E7%AD%BE)跳转；
6. 小程序不能跳转公众号，但是可以使用 `official-account` 组件关注关联的公众号；
7. [打开 App](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/launchApp.html)，当小程序从 APP 打开的场景打开时（场景值 1069），小程序会获得**返回 APP 的能力**，此时用户点击按钮可以打开拉起该小程序的 APP。即小程序不能打开任意 APP，只能 跳回 APP。

```html
<script>
  // 小程序跳转小程序
  wx.navigateToMiniProgram({
    appId: appid, // 对方小程序的appid
    path: path, // 目标页面的地址，需要的参数可以直接拼写到后边，path 中 ? 后面的部分会成为 query
    extraData: {
      // 需要传递给目标小程序的数据
      foo: 'bar'
    },
    envVersion: 'release', // 要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
    success(res) {
      // 打开成功的后续操作，比如埋点什么的
      // wxTelescope(baseKey + '-skip');
    }
  });
</script>

<!-- h5跳转小程序 -->
<script>
  // 需要配置
  wx.config({
    openTagList: ['wx-open-launch-weapp']
  });
</script>
<!-- 跳转按钮 -->
<wx-open-launch-weapp
  class="launch-btn"
  :username="tagUsername"
  :path="tagPath"
  @error="handleErrorFn"
  @launch="handleLaunchFn"
>
  <script type="text/wxtag-template">
    <div style="padding: 10000px">
      跳转按钮
    </div>
  </script>
</wx-open-launch-weapp>
```

## 🖇 踩坑

### 1、渠道参数处理

#### 小程序生命周期-热启动/冷启动及其相关参数获取

[小程序的运行机制](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/operating-mechanism.html)

- 冷启动：如果用户首次打开，或小程序销毁后被用户再次打开，此时小程序需要重新加载启动，即冷启动。
- 热启动：如果用户已经打开过某小程序，然后在一定时间内再次打开该小程序，此时小程序并未被销毁，只是从后台状态进入前台状态，这个过程就是热启动。
  - 常见如，启动后，扫码重新打开某个页面，或者点击配置的公众号导航等；

#### 参数获取方式的区别

1. [wx.getLaunchOptionsSync](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html)
   1. 获取小程序启动时的参数。与 `App.onLaunch` 的回调参数一致。
   2. **拿到的参数是冷启动的时候拿到的**。无论从哪里进来，在没有杀死进程的时候，该方法拿到的数据就是一样的。
2. [wx.getEnterOptionsSync](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getEnterOptionsSync.html)，**获取本次小程序启动时的参数。**
   1. 如果当前是冷启动，则返回值与 `App.onLaunch` 的回调参数一致，也就是与 wx.getLaunchOptionsSync 一致；
   2. **如果当前是热启动，则返回值与 App.onShow 一致**；
   3. 所以这里可以保持每次获取的参数与当前的启动参数是保持一致的，热启动的参数可以覆盖同名参数。
3. 当小程序被销毁的时候，两个参数都是获取不到想要的值的，所以对于进入后台的小程序，如果没必要就要主动关闭，避免放置一段时间后，再次打开造成参数错误；
   1. 当小程序进入后台，可以维持一小段时间的运行状态，如果这段时间内都未进入前台，小程序会被销毁。
   2. 当小程序占用系统资源过高，可能会被系统销毁或被微信客户端主动回收。

#### 渠道设置与获取

```js
// 设置channel，与一般的参数类似，可以通过修改小程序后台体验码来控制打开的参数，模拟渠道投放

// pages/index/index?channel=3UAKHCEV

// 获取当前的channel，可以针对不同的参数，做一些屏蔽或者替换操作
export const getChannel = () => {
  const { query } = wx.getEnterOptionsSync();
  const { channel } = query;
  return channel;
};
```

### 2、微信生成小程序二维码 scene 参数过长的方法

小程序二维码 scene 参数限定长度为 32 位字符，但是实际开发中可能有很多的参数需要传递,比如`pages/common/webview?url=https%3A%2F%2Fstatic.qa.92jkys.com%2Ff2e%2Fcustomer-h5-im%2F%23%2Fquick-ask%3FcurChannelInDisableList%3D0%26channel%3D27`，这个时候就需要通过特殊处理之后才能使用，常见方式如下：

1. 中间页 + 短参数；
   1. 会多出来一次跳转；
2. 短参数（当前选择的方案）；
   1. 目前在**进入页面时先判断是否有 scene 的值，如果有再请求接口获取完整的参数(json 格式)**，然后再使用这个参数去调真正的业务接口；
   2. 这种方式要确认好，会被打开的页面；

```js
// 调用
let options = wx.getEnterOptionsSync();
options = await queryLaunchParams(options);

// 方法定义：这里处理扫面二维码的时候，通过二维码的短参数获取存在数据库中的全部参数的操作
export const queryLaunchParams = async (options = {}) => {
  if (options.scene) {
    const { qrScene } = await store.dispatch('global/getParams', { destScene: options.scene });
    return { ...options, ...queryString.parse(qrScene) };
  } else {
    return options;
  }
};
```

### 3、`web-view` 打开 pdf 文件

#### 不能直接打开线上的 pdf，具体的步骤如下

1. 线上文件下载到本地，uni.downloadFile；
2. 本地打开所下载的 pdf，[uni.openDocument](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.openDocument.html)

具体代码：

```js
// 1. 这里要通过线上的地址去下载pdf，然后获取本地地址，之后再使用web-view打开
export const getDocumentLocalPath = (url = '') => {
  const types = ['.pdf'];
  const filterArr = types.filter(item => {
    return url.includes(item);
  });

  if (filterArr.length < 1) {
    return;
  }
  const fileType = filterArr[0];

  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url,
      success: function(res) {
        const filePath = res.tempFilePath;
        console.log('getDocumentLocalPath', url, filePath);
        wx.openDocument({
          filePath: filePath,
          fileType: fileType.slice(1),
          success: function(res) {
            // 使用pdf本地地址作为webview的地址，需要回退一下，不然就会有一个白页
            uni.navigateBack({
              delta: 1
            });
            resolve(filePath);
          }
        });
      },
      fail: function(e) {
        reject(e);
      }
    });
  });
};

// 2. 使用
const url = await getDocumentLocalPath(url);
// webview是可以打开本地生成的地址的
this.url = url;
```
