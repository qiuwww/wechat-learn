# uni-app下App转微信小程序的操作经验

## 背景

1. 就是老板觉得 app 比较难以开展，需要开发小程序版本方便用户引入；
   1. 个人觉得，我们的产品更偏向B端产品，需要公司整体入住，而不是散兵游勇的加入，没必要进行这样的引流，奈何我不是老板，那就干。
   2. 目前已经有二十几个页面及即时通信模块，已经可以稳定运行；
2. 后续新开发的功能要兼容到App和微信小程序；
3. 同时还要按照新的ui进行修改页面样式。

### 关于APP代码转小程序的方案研究

1. App的开发方案uni-app，本来就是留了兼容的方案的，但是目前有很多的业务，需要逐步测试优化；
2. 原始开发过程一般以h5为基础，然后兼容app的各种版本；
3. 开发过程，代码管理的考虑是需要切出一个新的打包小程序分支，这样对于基础的更新仍然在app端首先兼容开发，后续合并到具体的端开发分支上，然后做兼容问题处理，具体的分支如下：
   1. ft/base分支，仍旧以原本的App开发分支为准；
   2. ft/app分支，用做App的开发兼容测试；
      1. ft/app_android_qa，app的安卓端测试分支‘
      2. ...
   3. ft/mp分支，用做微信小程序开发兼容测试；

## 按着官方指导文档进行修改，对可预知的问题进行修改

1. [App正常，小程序、H5异常的可能性](https://zh.uniapp.dcloud.io/matter.html#app%E6%AD%A3%E5%B8%B8-%E5%B0%8F%E7%A8%8B%E5%BA%8F%E3%80%81h5%E5%BC%82%E5%B8%B8%E7%9A%84%E5%8F%AF%E8%83%BD%E6%80%A7)；
   1. 代码中使用了App端特有的plus、Native.js、subNVue、原生插件等功能，如下的地点坐标获取功能；
2. [微信小程序开发注意](https://uniapp.dcloud.net.cn/matter.html#%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%BC%80%E5%8F%91%E6%B3%A8%E6%84%8F)；
   1. 这里一个很重要的问题，需要对原始的项目进行分包，不然是绝对不能提交发布的；

### 地点坐标获取功能

本次开发中的**地理位置选择**功能，在App下使用了原生的高德地图服务，在小程序下边就需要改成腾讯地图的位置选择服务`uni.chooseLocation`；

**高德地图、腾讯地图以及谷歌中国区地图使用的是GCJ-02坐标系**，还好这两个使用的坐标系是一致的，否则就需要进行坐标的转换；

关联的bug报错：`getLocation:fail the api need to be declared in the requiredPrivateInfos field in app.json/ext.json`；

```json
// manifest.json，如下两个平台不需要同时配置
{
   // App应用，使用高德地图
   "sdkConfigs": {
   "geolocation": {
         "amap": {
            "__platform__": ["ios", "android"],
            "appkey_ios": "",
            "appkey_android": ""
         }
      },
      "maps": {
         "amap": {
            "appkey_ios": "",
            "appkey_android": ""
         }
      },
   },
   
   // 在小程序下使用地图选择，使用腾讯地图
   "mp-weixin": {
   "permission": {
      "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示"
      }
   },
   // 这里的配置是有效的
   "requiredPrivateInfos": ["getLocation", "chooseLocation"],
   }
}

```

### 契约锁

1. 契约锁，app下使用的是webview直接打开签订的合同；
2. 但是在小程序，需要引用契约锁的小程序插件页面；

```js
// App下打开webview进行操作
await navTo('/pages/common/webview');
export const navTo = (url, query) => {
  if (query) {
    url += `?query=${encodeURIComponent(JSON.stringify(query))}`;
  }
  return new Promise((resolve, reject) => {
    uni.navigateTo({
      url,
      success: (res) => {
        resolve(res);
      },
      fail: (e) => {
        reject(e);
      },
    });
  });
};

// 微信小程序下的处理方式
// 如下打开插件页面
const res = await wx.navigateTo({
   url: `plugin://qyssdk-plugin/${pageType}?ticket=${ticket}&hasCb=true&env=${baseUrl.qys_mp_env}`,
   success(res) {},
   fail(e) {},
});
```

### 微信小程序分包

1. 原始的App版本是在pages下边进行平铺的，没任何分包；
2. 小程序每个分包不能大于2M，主包也不能大于2M，分包总体积不超过 20M；
3. 在小程序下，分包：
   1. 主包，包括基础的一些配置，资源文件等，还要包括几个tab页面；
   2. 分包，按照业务模块进行划分：
      1. `"root": "pages/authenticate"`；
      2. `"root": "pages/team",`；
      3. `"root": "pages/salary",`；
      4. `"root": "pages/employ",`；
      5. ...
4. 分包之后需要相应的修改页面跳转的地址，当前版本主要在`pages.json`里边进行划分，所以需要修改的跳转地址并不是很多；

### 压缩资源文件大小

1. 对static目录进行整理；
   1. 压缩图片文件；
   2. 对于不着急展示的图片采用远端加载的方式；
2. 删除不需要的资源，如一些不兼容微信端的组件、不再用的组件等；

### 视频模块nvue页面的重写

1. 原本的组件不支持小程序，后续只能重新写这块；
2. 删除原本的App视频模块nvue页面；

### 即时通信模块的业务修改

1. 这块的核心是推送即时消息，在小程序下很容易收不到，最后的方案是做一个新的页面，去提示下载打开App操作；
2. 删除原本的App即时通信所引入的各种资源文件；

### 整体ui的修改

1. 修改基础的样式定义变量；
   1. 修改uni.scss文件，修改为新的ui风格；
2. 对硬页面的ui逐步修改；

### 小程序的按需注入

小程序配置：`lazyCodeLoading`，在 mp-weixin 下边配置；

## 直接运行代码，对着bug进行逐步修改

在开发工具中运行，查看控制台以及小程序评分、优化体验等的提示进行。

### Error: 暂不支持动态组件[undefined]，Errors compiling template: :style 不支持 `height: ${scrollHeight}px` 语法

其实就是 style 的一种写法的问题，语法问题：

```vue
<div :style="`height: ${scrollHeight}px`" => :style="{height: `${scrollHeight}px`}">
</div>
```

```:style="`height: ${scrollHeight}px`" => :style="{height: `${scrollHeight}px`}"```

### `http://test.XXX.com` 不在以下 request 合法域名列表中

配置request合法域名的问题，参考文档：<https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html>，添加后正常。

### Unhandled promise rejection

当 Promise 的状态变为 rejection 时，我们没有正确处理，让其一直冒泡（propagation），直至被进程捕获。这个 Promise 就被称为 unhandled promise rejection。

### Error: Compile failed at pages/message/components/Chat.vue

```vue
<!-- 小程序下不能支持动态组件；-->

<template>
   <Component
   :is="chatComponent(chat)"
   :chat="chat"
   :optionsQuery="optionsQuery"
   />
</template>
```

只能删除后使用v-if进行判断展示；

### 无效的 page.json ["titleNView"]

也就是这里的头信息不能支持这个配置，直接删除。

## 代码质量的问题 / 代码优化

### common/vendor 过大的问题

1. [uni-app 微信小程序 vendor.js 过大的处理方式和分包优化](https://blog.csdn.net/weixin_42211816/article/details/121330283)；
   1. 使用运行时代码压缩；
      1. HBuilder 直接开启压缩，但是这样会编译过程变慢；
      2. cli 创建的项目可以在 package.json 中添加参数`–minimize`
2. [vendor.js 过大的处理方式](https://uniapp.dcloud.net.cn/matter.html#vendor-js-%E8%BF%87%E5%A4%A7%E7%9A%84%E5%A4%84%E7%90%86%E6%96%B9%E5%BC%8F)；
   1. 开启压缩；
   2. 分包，对一些非主包引用的资源引用位置进行修改；

## 总结

1. 方向很重要，预先的系统选型要多考虑以后的需要，不要太相信老板的话，可能开始说不要，后边就要了；
2. uni-app框架下，兼容多端的修改还是容易处理的，一般只会发生几类问题，有时候看起来很严重，其实并不严重；

以上只是个人见解，请指教，[个人blog](https://github.com/qiuwww/blog/tree/master/0.5.JS/%E5%BC%82%E6%AD%A5%E7%BC%96%E7%A8%8B)。
