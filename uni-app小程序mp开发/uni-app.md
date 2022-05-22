# 使用 uni-app 开发应用

1. uni 需要兼容多端，同时处理 h5/app/小程序，多端能力，所以接口就比较多，文档就比较多；
2. 基本上可以用到的 api，uni 都有对应，比如网络状态；

## 初始配置项目，可以我认为是一个 vue 项目

[通过 vue-cli 创建 uni-app 项目](https://uniapp.dcloud.io/quickstart?id=_2-%e9%80%9a%e8%bf%87vue-cli%e5%91%bd%e4%bb%a4%e8%a1%8c)

`vue create -p dcloudio/uni-preset-vue uni-app-miniprogram`

选择 uni-app 模板。

## 查看官方文档，确认一些基础问题

<!-- todo -->

1. 是否可用 ts；
2. 脚手架创建的项目区分，找一个简介的；
3. 公共样式配置；
4. app 打包流程打通；
5. nvue 是个什么？
6. 跨端兼容

## [uni-app 文档阅读](https://uniapp.dcloud.io/)

1. 条件编译；
2. nvue，局部使用更合适；
3. HBuilder X；

同时也应该看一下小程序的开发文档。

### 初始化项目 & 修改项目

#### 模板选择

1. 默认模板：极简单项目，hello world；
2. uni-app 项目：包含 uni-app 的**扩展组件（uni-ui）**的项目。
3. hello uni-app： 演示项目可以作为一个项目模板；

#### [运行项目](https://uniapp.dcloud.io/quickstart-hx?id=%e8%bf%90%e8%a1%8cuni-app)

运行 -> 运行到小程序模拟器；打开小程序开发工具 -> /Users/qiuww/code/learn/data-collection-FullStack/docs/hbuilderx-demo3/unpackage/dist/dev/mp-weixin。

### 组件

[组件](https://uniapp.dcloud.io/component/README?id=%e5%9f%ba%e7%a1%80%e7%bb%84%e4%bb%b6)

[项目示例](https://hellouniapp.dcloud.net.cn/pages/component/view/view)

**视图容器**

1. view => div;
2. scroll-view：可滚动视图区域。用于区域滚动。
   1. 使用竖向滚动时，需要给 <scroll-view> 一个固定高度，通过 css 设置 height。
3. swiper：滑块视图容器。一般用于左右滑动或上下滑动，比如 banner 轮播图。
   1. 注意**滑动切换**和**滚动**的区别。
   2. 使用竖向滚动时，需要给 <scroll-view> 一个固定高度，通过 css 设置 height。
   3. 其中只可放置 <swiper-item> 组件，否则会导致未定义的行为。
4. match-media：media query 匹配检测节点，媒体查询。
5. movable-area：可拖动**区域组件**。
   1. **由于 app 和小程序的架构是逻辑层与视图层分离**，使用 js 监听拖动时会引发逻辑层和视图层的频繁通讯，影响性能。为了方便高性能的实现拖动，平台特封装了 movable-area 组件。
6. movable-view：可移动的**视图容器**，在页面中可以拖拽滑动或双指缩放。
7. cover-view：覆盖在原生组件上的**文本视图**。
8. cover-image：覆盖在原生组件上的图片视图。可覆盖的原生组件同 cover-view，**支持嵌套在 cover-view 里**。

**基础内容**

1. icon：图标。
2. text：文本组件，是一个文本就必须放在这个标签内部；
   1. <text> 组件内只支持嵌套 <text>；
   2. decode 可以解析的有 &nbsp; &lt; &gt; &amp; &apos; &ensp; &emsp;。
3. rich-text：富文本。
   1. [支持一般的 html 节点及属性](https://uniapp.dcloud.io/component/rich-text?id=%e5%8f%97%e4%bf%a1%e4%bb%bb%e7%9a%84html%e8%8a%82%e7%82%b9%e5%8f%8a%e5%b1%9e%e6%80%a7)；
4. progress：进度条。

**表单组件**

1. button：按钮。
   1. 这里注意这些获取小程序权限操作的属性；
      1. @getphonenumber
      2. @getuserinfo
      3. @opensetting
   2. 注意配置设置：open-type；
2. editor：富文本编辑器，可以对图片、文字格式进行编辑和混排。
3. picker：从底部弹起的滚动选择器。**支持五种选择器，通过 mode 来区分**，分别是普通选择器，多列选择器，时间选择器，日期选择器，省市区选择器，默认是普通选择器。
4. picker-view：嵌入页面的滚动选择器。
5. slider：滑动选择器。
   1. 注意区分与 progress 的区别；

**路由与页面跳转**

1. navigator：页面跳转。该组件类似 HTML 中的<a>组件，但只能跳转本地页面。目标页面必须在 pages.json 中注册。

**媒体组件**

1. audio
2. vedio
3. image
4. camera：页面内嵌的区域相机组件。注意这不是点击后全屏打开的相机。
5. live-player：实时音视频播放，也称**直播拉流**。
6. live-pusher：实时音视频录制，也称直播推流。

**地图**

1. map：地图组件。地图组件用于展示地图，而定位 API 只是获取坐标，请勿混淆两者。
   1. 小程序和 app-vue 中，<map> 组件是由引擎创建的原生组件，它的层级是最高的，不能通过 z-index 控制层级。

**画布**

1. canvas：画布。
   1. canvas 标签默认宽度 300px、高度 225px，动态修改 canvas 大小后需要重新绘制。
   2. canvas 的常用用途有图表和图片处理，在 uni-app 插件市场有大量基于 canvas 的插件。

**webview**

1. web-view：web-view 是一个 web 浏览器组件，可以用来承载网页的容器，会自动铺满整个页面（nvue 使用需要手动指定宽高）。
   1. 各小程序平台，web-view 加载的 url **需要在后台配置域名白名单**，包括内部再次 iframe 内嵌的其他 url 。

### 扩展组件（uni-ui），在基础组建上的扩展，可以理解为 block

1. uni-ui 是 DCloud 提供的一个跨端 ui 库，它是基于 vue 组件的、flex 布局的、无 dom 的跨全端 ui 框架。
2. uni-ui 不包括基础组件，它是基础组件的补充。
3. **uni ui 属于 vue 组件**，uni-app 引擎底层自动 diff 更新数据。当然其实插件市场里众多 vue 组件都具备这个特点。
4. uni ui 的组件都是**多端自适应的**，**底层会抹平很多小程序平台的差异或 bug**。
5. uni ui 的默认风格是中型的，与 uni-app 基础组件风格一致。**但它支持 uni.scss**，可以方便的扩展和切换 App 的风格。

#### 引入方式

1. **在 HBuilderX 新建 uni-app 项目的模板中**，选择 uni ui 模板 由于 uni-app 独特的 easycom 技术，可以免引用、注册，直接使用各种符合规则的 vue 组件。
2. 单独安装组件 如果你没有创建 uni ui 项目模板，也可以在你的工程里，单独安装需要的那个组件。[举例如](https://ext.dcloud.net.cn/plugin?id=21)
3. 主要是一组自己封装的组件；

#### 主要的组件

1. icons
2. 等

### template

主要是一些自定义的 block；

### apis

一些常用的操作举例。

#### 基础

1. console： 向控制台打印日志信息。
2. debug：向控制台打印 debug 日志
3. 定时器：
   1. App 端返回的定时器编号可能为 String 类型，使用时无需主动转换为 Number 类型
4. 生命周期：
   1. 这里的生命周期比较多，主要是因为需要兼容的端比较多；
   2. [应用生命周期](https://uniapp.dcloud.io/collocation/frame/lifecycle?id=%e5%ba%94%e7%94%a8%e7%94%9f%e5%91%bd%e5%91%a8%e6%9c%9f)关键的地方：
      1. onLaunch，当 uni-app 初始化完成时触发（全局只触发一次）
      2. onPageNotFound
      3. onThemeChange
      4. 应用生命周期仅可在 App.vue 中监听，在其它页面监听无效。
   3. [页面生命周期](https://uniapp.dcloud.io/collocation/frame/lifecycle?id=%e9%a1%b5%e9%9d%a2%e7%94%9f%e5%91%bd%e5%91%a8%e6%9c%9f)：
      1. onInit：监听页面初始化，其参数同 onLoad 参数，为上个页面传递的数据，参数类型为 Object（用于页面传参），触发时机早于 onLoad（仅百度小程序基础库 3.260 以上支持 onInit 生命周期）；
      2. onLoad
      3. onReady：监听页面初次渲染完成。注意如果渲染速度快，会在页面进入动画完成前触发
      4. onPullDownRefresh：监听用户下拉动作，一般用于下拉刷新

#### 网络

1. uni.request(OBJECT)：发起网络请求。
   1. 在各个小程序平台运行时，网络相关的 API 在使用前需要配置域名白名单。
   2. 只有 post/get 都支持；
   3. 最终发送给服务器的数据是 String 类型，如果传入的 data 不是 String 类型，会被转换成 String。
   4. complete：接口调用结束的回调函数（调用成功、失败都会执行）
   5. abort 方法，可以配合页面推出操作，避免一些问题；
2. 将本地资源上传到开发者服务器，客户端发起一个 POST 请求，其中 content-type 为 multipart/form-data。
   1. 网络请求的 超时时间 可以统一在 manifest.json 中配置。
3. uni.connectSocket(OBJECT)

#### 路由与页面跳转

1. uni.navigateTo(OBJECT)：**保留当前页面**，跳转到应用内的某个页面，使用 uni.navigateBack 可以返回到原页面。
2. uni.redirectTo(OBJECT)：**关闭当前页面**，跳转到应用内的某个页面。
3. uni.reLaunch(OBJECT)：关闭所有页面，打开到应用内的某个页面。
4. uni.switchTab(OBJECT)：**跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面**。
5. uni.navigateBack(OBJECT)：关闭当前页面，返回上一页面或多级页面。**可通过 getCurrentPages() 获取当前的页面栈**，决定需要返回几层。
6. uni.preloadPage(OBJECT)：**预加载页面，是一种性能优化技术**。被预载的页面，在打开时速度更快。
   1. 预加载 /pages/test/test **对应的 js 文件**，不执行页面预渲染逻辑。

```js
uni.preloadPage({ url: '/pages/test/test' }); // 预加载 /pages/test/test 页面（仅触发onLoad，onReady)
uni.navigateTo({ url: '/pages/test/test' }); // url匹配，跳转预加载页面（仅触发onShow)
uni.navigateTo({ url: '/pages/test/test?a=b' }); // url不匹配，正常打开新页面
```

#### 数据存储

1. uni.setStorage(OBJECT)：将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个**异步接口**。
2. uni.getStorageInfo(OBJECT)：异步获取当前 storage 的相关信息。
   1. 区别与 getStorage，这里获取的是全部的信息；

#### 媒体

1. editorContext：editor 组件对应的 editorContext 实例，可通过 uni.createSelectorQuery 获取。

#### 设备

1. 系统信息：uni.canIUse(String)：判断应用的 **API，回调，参数，组件**等是否在当前版本可用。
2. uni.makePhoneCall(OBJECT)：**拨打电话**。
3. uni.scanCode(OBJECT)：调起客户端扫码界面，扫码成功后返回对应的结果。
4. uni.setClipboardData(OBJECT)：设置**系统剪贴板**的内容。
5. uni.vibrate(OBJECT)：使**手机发生振动**。

#### 界面

1. [uni.createSelectorQuery()](https://uniapp.dcloud.io/api/ui/nodes-info?id=createselectorquery)：**返回一个 SelectorQuery 对象实例**。可以在这个实例上使用 select 等方法选择节点，并使用 boundingClientRect 等方法选择需要查询的信息。
   1. 当前对象用于操作元素，约等于 document；

#### 三方服务

1. uni.getProvider(OBJECT)：获取服务供应商。
2. 登陆注册：
   1. uni.login(OBJECT)： 登录 = wx.login；
   2. uni.getUserInfo(OBJECT)：获取用户信息。wx.login；
   3. wx.getSetting，获取微信的配置信息；
3. 小程序授权：
   1. uni.authorize(OBJECT)，**这样难道就不需要按钮点击了？**
   2. 提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功。如果用户之前拒绝了授权，此接口会直接进入失败回调，一般搭配 uni.getSetting 和 uni.openSetting 使用。
4. 小程序跳转：
   1. uni.navigateToMiniProgram(OBJECT)：打开另一个小程序。
5. 运动(计步器)： sport 运动：此功能为计步器，用于获取手机用户的运动步数。

#### 消息

1. 模板消息
2. 订阅消息：uni.requestSubscribeMessage(Object object)

#### 更新

1. uni.getUpdateManager()：本 API 返回全局唯一的版本更新管理器对象： updateManager，用于管理小程序更新。

#### 开发

1. uni.setEnableDebug(OBJECT)：设置是否打开调试开关。此开关对正式版也能生效。
2. condition：启动模式配置，仅开发期间生效，用于模拟直达页面的场景，如：小程序转发后，用户点击所打开的页面。 => 相当于设置 pages 的第一个页面为当前需要打开的。
3. [manifest.json:mp-weixin]配置选想https://uniapp.dcloud.io/collocation/manifest?id=mp-weixin

#### [头部导航栏/自定义导航栏使用注意](https://uniapp.dcloud.io/collocation/pages?id=customnav)

1. 当 navigationStyle 设为 custom 或 titleNView 设为 false 时，原生导航栏不显示。
   1. **非 H5 端**，手机顶部状态栏区域会被页面内容覆盖。这是因为**窗体是沉浸式的原因，即全屏可写内容**。

#### [页面通信](https://uniapp.dcloud.io/api/window/communication?id=emit)

1. **uni.$emit(eventName,OBJECT)**：触发全局的自定义事件，附加参数都会传给监听器回调函数。
2. **uni.$on(eventName,callback)**：监听全局的自定义事件，事件由 uni.$emit 触发，回调函数会接收事件触发函数的传入参数。

### 配置

1. **App.vue** 是 uni-app 的**主组件**，所有页面都是在 App.vue 下进行切换的，是**页面入口文件**。但 App.vue 本身不是页面，**这里不能编写视图元素**。
2. **uni.scss** 文件的用途是为了方便整体控制应用的风格。比如按钮颜色、边框风格，uni.scss 文件里预置了一批**scss 变量预置**。
3. **vue.config.js** 是一个可选的配置文件，如果项目的根目录中存在这个文件，那么它会被自动加载，一般用于配置 webpack 等编译选项。
4. **manifest.json** 文件是应用的配置文件，用于指定应用的名称、图标、权限等。HBuilderX 创建的工程此文件在根目录，CLI 创建的工程此文件在 src 目录。
5. pages.json 文件用来对 uni-app 进行全局配置，决定页面文件的路径、窗口样式、原生的导航栏、底部的原生 tabbar 等。
   1. 在 App.vue 中，**可以一些定义全局通用样式**，例如需要加一个通用的背景色，首屏页面渲染的动画等都可以写在 App.vue 中。（这里与定义的变量是分开的）
   2. 在 pages.json 内添加全局变量，小程序有 globalData，这是一种简单的全局变量机制。
      1. getApp()：getApp() 函数用于获取当前应用实例，一般用于获取 globalData 。
   3. getCurrentPages()：getCurrentPages() 函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。

## 框架说明

### 开发规范

1. 接口能力（JS API）**靠近微信小程序规范**，但需将前缀 wx 替换为 uni；
2. 为兼容多端运行，建议使用 flex 布局进行开发；

### 目录结构

```
├─hybrid                存放本地网页的目录，web-veiw标签内嵌内容
├─platforms             存放各平台专用页面的目录
├─static                存放应用引用静态资源（如图片、视频等）的目录，注意：静态资源只能存放于此
├─wxcomponents          存放小程序组件的目录
├─main.js               Vue初始化入口文件
├─App.vue               应用配置，用来配置App全局样式以及监听
```

#### tips

1. 编译到任意平台时，static 目录下的文件均会被打包进去，非 static 目录下的文件（vue、js、css 等）被引用到才会被包含进去。
   1. 也就是说 static 中的文件，即便不被引用也会被打包进去；
2. static 目录下的 js 文件不会被编译，如果里面有 es6 的代码，不经过转换直接运行，在手机设备上会报错。
3. css、less/scss 等资源同样不要放在 static 目录下，建议这些公用的资源放在 common 目录下。

#### [页面栈](https://uniapp.dcloud.io/frame?id=%e9%a1%b5%e9%9d%a2%e6%a0%88)

#### 运行环境判断

1. 环境判断（开发环境和生产环境），uni-app 可通过 **process.env.NODE_ENV** 判断当前环境是开发环境还是生产环境。一般用于连接测试服务器或生产服务器的动态切换。
2. 判断平台：平台判断有 2 种场景，一种是在编译期判断，一种是在运行期判断。
   1. // #ifdef H5 -> // #endif
   2. uni.getSystemInfoSync().platform: android | ios | h5

#### 页面尺寸

1. 尺寸单位：uni-app 支持的通用 css 单位包括 px、rpx
   1. rpx 即响应式 px，一种根据屏幕宽度自适应的动态单位。以 750 宽的屏幕为基准，750rpx 恰好为屏幕宽度。屏幕变宽，rpx 实际显示效果会等比放大；
   2. rpx 类似于 rem 了；
   3. 但在 App 端和 H5 端屏幕宽度达到 960px 时，**默认将按照 375px 的屏幕宽度进行计算**。
   4. rpxCalcBaseDeviceWidth： Number 375 rpx 计算使用的基准设备宽度，设备实际宽度超出 rpx 计算所支持的最大设备宽度时将按基准宽度计算，单位 px
      1. 这里就有一个问题了，如果是大屏幕，这样就会导致一个问题，页面样式出错，这里需要在大的布局上边使用 flex 布局，内里使用 rpx；
   5. rpxCalcIncludeWidth Number 750 rpx 计算特殊处理的值，**始终按实际的设备宽度计算**，单位 rpx
2. **注意 rpx 是和宽度相关的单位，屏幕越宽，该值实际像素越大**。如不想根据屏幕宽度缩放，则应该使用 px 单位。
   1. 如果开发者在字体或高度中也使用了 rpx ，那么需注意这样的写法意味着随着屏幕变宽，字体会变大、高度会变大。**如果你需要固定高度，则应该使用 px** 。
   2. App 端，在 pages.json 里的 titleNView 或页面里写的 plus api 中涉及的单位，只支持 px，不支持 rpx。

#### 选择器及内置变量

1. 在 uni-app 中不能使用 \* 选择器。
2. 微信小程序自定义组件中仅支持 class 选择器。
3. page 相当于 body 节点。
4. uni-app [提供内置 CSS 变量](https://uniapp.dcloud.io/frame?id=css%e5%8f%98%e9%87%8f)。
   1. --status-bar-height 系统状态栏高度。
   2. --window-top 内容区域距离顶部的距离。
   3. --window-bottom 内容区域距离底部的距离。
5. bottom: calc(var(--window-bottom) + 10px)，可以使用 calc 的。
6. uni-app 中以下组件的高度是固定的，不可修改：
   1. NavigationBar 导航栏 44px 44px
   2. TabBar 底部选项卡

#### 背景图片

1. 本地背景图片的引用路径推荐使用以 ~@ 开头的绝对路径。
2. 微信小程序不支持相对路径（真机不支持，开发工具支持）

#### NPM 支持

1. 为多端兼容考虑，建议优先从 uni-app 插件市场 获取插件。直接从 npm 下载库很容易只兼容 H5 端。
2. 非 H5 端不支持使用含有 dom、window 等操作的 vue 组件和 js 模块。

## 打包发布

1. 使用 hbuildx 的云打包，完成后去下载；
2. **打包成资源**（cli 只能做到这一步），然后通过 andriod studio/xcode 进行打包；

## [跨端兼容](https://uniapp.dcloud.io/platform)

1. 窗口样式相关的 API：**获取对应窗口的样式，返回一个 css 属性值对象**; 设置对应窗口的样式，传入一个 css 属性值对象；
2. NodesRef：用于获取节点信息的对象；

## TypeScript 支持

既是 ts 支持。

## nvue 类比 weex

1. uni-app App 端内置了一个基于 weex 改进的原生渲染引擎，提供了原生渲染能力。

2. **在 App 端**，**如果使用 vue 页面，则使用 webview 渲染**；
3. **如果使用 nvue 页面(native vue 的缩写)，则使用原生渲染**。一个 App 中可以同时使用两种页面，比如首页使用 nvue，二级页使用 vue 页面，hello uni-app 示例就是如此。
4. 虽然 nvue 也可以多端编译，输出 H5 和小程序，**但 nvue 的 css 写法受限**，所以如果你不开发 App，那么不需要使用 nvue。
5. 以往的 **weex ，有个很大的问题是它只是一个高性能的渲染器**，没有足够的 API 能力（比如各种 push sdk 集成、蓝牙等能力调用），使得开发时非常依赖原生工程师协作，开发者本来想节约成本，结果需要前端、iOS、Android 3 拨人开发，适得其反。
   1. nvue 解决了这个问题，**让前端工程师可以直接开发完整 App**，并提供丰富的插件生态和云打包。这些组合方案，帮助开发者切实的提高效率、降低成本。

## uni-app 对于单纯的 h5 项目不适合

1. 因为会把原生的标签进行转换，转换的结构就不单一了。
