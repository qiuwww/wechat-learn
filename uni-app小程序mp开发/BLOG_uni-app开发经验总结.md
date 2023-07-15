# uni-app开发经验总结

## uni-app介绍及对其优缺点理解

1. **开发多端兼容**应用的一种较好的方案：
   1. 开发者编写一套代码，可发布到iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝）、快应用等多个平台，**常见平台基本上都可以被兼容到**；
   2. **开发体验还是相对较好的**，很多时候可以在h5开发，然后在app或者mp上调整一下就可以用了；
      1. 个人感觉相对于rn这种需要一直运行在真机或者模拟器上，开发体验是要好一些；
   3. 如果没有多端兼容的需求或者预留平台开发的任务，**只是为了开发一种平台**，还是建议使用对应比较成熟的技术会更好一些；
      1. 如纯原生的Android或者IOS，性能肯定是要更好一点的；
      2. 一般H5的开发体验也比用uni好一些；
   4. 跨端也不是说一劳永逸不需要对相应的端进行测试和兼容的，还是会有一些问题需要处理的，如官方知道的[跨端注意事项](https://zh.uniapp.dcloud.io/matter.html)；
      1. 有时候一些关键的点上走不通，可能就需要花费很多额外的工作去做相应端的兼容，如百度小程序不支持`scoped`；
      2. [App转为微信小程序的一点经验](https://juejin.cn/post/7255879340223184956)；
      3. 另一些**三方sdk**，只兼容了android或者ios的原生，根本没考虑uni-app的情况，这个时候就要费劲的去做兼容处理，需要做原生混合编码，对纯前端来说不是很友好，可能还是需要原生的app开发进行操作；
2. 从Vue过渡过去成本非常低，**不会有太多额外的学习成本**：
   1. uni基于通用的前端技术栈，采用vue语法+微信小程序api，无额外学习成本；
   2. 对于使用uni来开发App来说，直接跳过了学习weex的环节；
   3. 对于App原生有的时候会需要用到nvue的技术；
      1. 这里语法差别不是很大，通常情况下`.vue`组件直接修改为`.nvue`就可以了，nvue就是weex上补充了uni的jsApi；
      2. **但是其只能兼容到App，其他平台还要额外添加额外组件去处理，这就会是维护成本上升**；
3. 兼容HBuilder和cli的方案：
   1. 这里的开启压缩，会造成编译时间增加，有的时候不开启压缩，可能小程序都没法提交；
   2. 使用cli模式与开发一般的Vue项目的流程和配置差别不大；
   3. cli模式下，还没法云打包App；
4. **条件编译**，用于在一个组件内处理不同平台逻辑：
   1. **过多的条件编译代码会造成代码看起来很臃肿**；
   2. 这样也会造成代码稍微改变，就要同时测试多端的代码，很多时候的一些bug都是不能预料的；
   3. 这个时候宁愿写成多个组件，也比混在一起会好一些；
5. 组件与组件库：
   1. [官方提供的组件](https://zh.uniapp.dcloud.io/component/)，分为内置组件和[扩展组件(uni-ui)](https://hellouniapp.dcloud.net.cn/pages/component/view/view)；
      1. 内置组件直接使用；
      2. 扩展组件需要引入，使用的示例[参考hello world项目](https://hellouniapp.dcloud.net.cn/pages/component/view/view)，与[一般的HBuilder插件](https://ext.dcloud.net.cn/plugin?id=55)使用方式一致；
   2. 三方库的质量不是很高，[DCloud插件市场](https://ext.dcloud.net.cn/?cat1=2&cat2=21&type=HotList)上有很多提交，很多重复的轮子，很多时候不是很方便找到一个适合的组件，可能真的测试了几遍才知道具体使用哪个；
6. 开放生态，但是不开放源码：
   1. 有时候的一些问题无法解决，也看不到底层的一些处理逻辑，这就对开发项目造成了一些不确定性；
   2. [需求墙](https://vote.dcloud.net.cn/#/?name=HBuilderX)，还有很多待处理的问题，一些已经放了很久没人处理；
7. 随着使用人数的增加，云打包App的时间会急剧增加：
   1. 以前的时候大约1-2min，现在动辄30min+，以前云打包确实很方便；
   2. **配置和使用本地打包还是挺繁琐的**，相对于使用诸如`Android Studio`，`XCode`这类的工具进行一键打包。这里会多出来一个生成资源包的步骤，还需要手动复制到目标文件夹中，相对繁琐；

## uni-app开发微信小程序和App经验

### [微信小程序双线程运行机制 | 渲染层和逻辑层](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/framework.html#%E6%B8%B2%E6%9F%93%E5%B1%82%E5%92%8C%E9%80%BB%E8%BE%91%E5%B1%82)

1. 渲染层的界面使用了 WebView 进行渲染；
   1. wxss，可以独立的在视图层运行，而不需要逻辑层；
   2. 重渲染机制，wxss节点越少，嵌套越少，渲染效率越高；
      1. 节点要小于1000个，层数要小于30层；
2. 逻辑层采用 JsCore 线程运行JS脚本；
   1. 借助`wxWebAssembly`的原理，使用编译型语言，如c，go等来替代解释性语言（运行时）JS，从而来提高性能；
3. native层，用于以上两者进行通信；
   1. 一个小程序存在多个界面，所以渲染层存在多个WebView线程，这两个线程的通信会经由微信客户端native做中转，逻辑层发送网络请求也经由native转发；
   2. 逻辑层需要处理数据，调用setData来将数据传递到渲染层；
      1. setData，传递的数据不能超过256kb，超过就会卡顿；
      2. 频繁的调用setData，也会出现明显的卡顿现象；
      3. 使用uni-app开发的微信小程序，因为智能的处理的数据的diff，比大多人手写的原生小程序的性能还好。

只有逻辑层和视图层代码全部注入后，并且时间点对齐后，才会开始第三阶段首屏渲染的工作。
**在渲染完界面之后，页面实例就会收到一个 onLoad 的回调**，你可以在这个回调处理你的逻辑。

#### 小程序与普通网页开发的区别

1. **网页开发渲染线程和脚本线程是互斥的**，这也是为什么长时间的脚本运行可能会导致页面失去响应，**而在小程序中，二者是分开的，分别运行在不同的线程中**；
   1. 逻辑层运行在 JSCore 中，并没有一个完整浏览器对象，因而缺少相关的 DOM API 和 BOM API。**这一区别导致了前端开发非常熟悉的一些库，例如 jQuery、 Zepto 等，在小程序中是无法运行的。**同时 JSCore 的环境同 NodeJS 环境也是不尽相同，所以一些 NPM 的包在小程序中也是无法运行的。
2. 小程序的体验和用户粘性要好于h5；h5的权限问题及更新要比小程序方便很多；

### 小程序[运行机制](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/operating-mechanism.html)

1. 前台后台：
   1. 前台：界面被展示给用户；
   2. 后台：小程序还可以短暂运行一小段时间，**但部分 API 的使用会受到限制**。
2. 启动方式：
   1. 冷启动，如果用户首次打开，或小程序销毁后被用户再次打开，此时小程序需要重新加载启动，即冷启动：
      1. App启动生命周期
         1. onLaunch
         2. onLoad
         3. onReady
            1. 在其之前，使用骨架屏技术可以提高展示效率；
      2. Page的生命周期，注册小程序中的一个页面。接受一个 Object 类型参数，其指定页面的初始数据、生命周期回调、事件处理函数等；
         1. onLoad
         2. onShow
         3. onHide
   2. 热启动，如果用户已经打开过某小程序，然后在一定时间内再次打开该小程序，此时小程序并未被销毁，只是从后台状态进入前台状态，这个过程就是热启动：
      1. 30min以内，再次进入前台；
   3. 切后台 5s 后会被**挂起**：
      1. 微信会停止小程序 JS 线程的执行；
      2. 此时**小程序的内存状态会被保留**，但开发者代码执行会停止，事件和接口回调会在小程序再次进入「前台」时触发；
      3. 当开发者使用了后台音乐播放、后台地理位置等能力时，**小程序可以在「后台」持续运行，不会进入到「挂起」状态**；
   4. 挂起 30min 后会被**销毁**，重新启动就是冷启动：
      1. 如果用户很久没有使用小程序，或者系统资源紧张，小程序会被「销毁」，即完全终止运行；
      2. 每当小程序可能被销毁之前，页面回调函数 onSaveExitState 会被调用。如果想保留页面中的状态，可以在这个回调函数中“保存”一些数据，下次启动时可以通过 exitState 获得这些已保存数据。
   5. 重新启动策略：
      1. restartStrategy 配置项可以改变这个默认的行为，使得**从某个页面退出**后，下次 A 类场景的冷启动可以回到这个页面。

### 路由与页面跳转

1. `uni.navigateTo(OBJECT)`：**保留当前页面**，跳转到应用内的某个页面，使用 `uni.navigateBack` 可以返回到原页面；
2. `uni.redirectTo(OBJECT)`：**关闭当前页面**，跳转到应用内的某个页面；
3. `uni.reLaunch(OBJECT)`：关闭所有页面，打开到应用内的某个页面；
4. `uni.switchTab(OBJECT)`：**跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面**。
5. `uni.navigateBack(OBJECT)`：关闭当前页面，返回上一页面或多级页面。**可通过 getCurrentPages() 获取当前的页面栈**，决定需要返回几层；
6. `uni.preloadPage(OBJECT)`：**预加载页面，是一种性能优化技术**。被预载的页面，在打开时速度更快，预加载 `/pages/test/test` **对应的 js 文件**，不执行页面预渲染逻辑；

```js
uni.preloadPage({ url: '/pages/test/test' }); // 预加载 /pages/test/test 页面（仅触发onLoad，onReady)
uni.navigateTo({ url: '/pages/test/test' }); // url匹配，跳转预加载页面（仅触发onShow)
uni.navigateTo({ url: '/pages/test/test?a=b' }); // url不匹配，正常打开新页面
```

### static目录

1. 一些静态资源需要放在static，才能被访问到，如图片这些；
2. static内的所有资源都会被打包进去，所以不需要的资源在发布的时候一定要删掉；
3. static 目录下的 js 文件不会被编译，如果里面有 es6 的代码，不经过转换直接运行，在手机设备上会报错；
4. css、less/scss 等资源同样不要放在 static 目录下，建议这些公用的资源放在 common 目录下。

### [nvue](https://zh.uniapp.dcloud.io/tutorial/nvue-outline.html#nvue%E4%BB%8B%E7%BB%8D) 与 weex

1. **nvue就是weex上补充了uni的jsApi**；
2. uni-app App 端内置了一个基于 weex 改进的原生渲染引擎，提供了原生渲染能力；
3. **在 App 端**，**如果使用 vue 页面，则使用 webview 渲染**；
4. **如果使用 nvue 页面(native vue 的缩写)，则使用原生渲染**。一个 App 中可以同时使用两种页面，比如首页使用 nvue，二级页使用 vue 页面，hello uni-app 示例就是如此；
5. 虽然 nvue 也可以多端编译，输出 H5 和小程序，**但 nvue 的 css 写法受限**，所以如果你不开发 App，那么不需要使用 nvue；
6. 以往的 **weex ，有个很大的问题是它只是一个高性能的渲染器**，没有足够的 API 能力（比如各种 push sdk 集成、蓝牙等能力调用），使得开发时非常依赖原生工程师协作，开发者本来想节约成本，结果需要前端、iOS、Android 3 拨人开发，适得其反；
   1. nvue 解决了这个问题，**让前端工程师可以直接开发完整 App**，并提供丰富的插件生态和云打包。这些组合方案，帮助开发者切实的提高效率、降低成本。

### [尺寸单位](https://zh.uniapp.dcloud.io/tutorial/syntax-css.html#%E5%B0%BA%E5%AF%B8%E5%8D%95%E4%BD%8D)

1. rpx（responsive pixel）: 可以**根据屏幕宽度进行自适应**。规定屏幕宽为 750rpx。如在 iPhone6 上，屏幕宽度为 375px，共有 750 个物理像素，则 750rpx = 375px = 750 物理像素，1rpx = 0.5px = 1 物理像素；
   1. iPhone5 1rpx = 0.42px 1px = 2.34rpx
   2. iPhone6 1rpx = 0.5px 1px = 2rpx
   3. iPhone6 Plus 1rpx = 0.552px 1px = 1.81rpx
2. 所以这里与 rem 一个意思，如果控制宽高，可以使用这个，页面的宽度的是固定的，但是对于字体大小还是不要使用这个，直接使用 px 来表示（不然字体大小会改变）；
   1. 不过问题也不大；
3. 注意：
   1. 在较小的屏幕上不可避免的会有一些毛刺，请在开发时尽量避免这种情况；
   2. 注意 rpx 是和宽度相关的单位，屏幕越宽，该值实际像素越大。如不想根据屏幕宽度缩放，则应该使用 px 单位；
      1. 这里与h5开发的rem意思差不多，字体控制还是要用绝对的px，不然页面宽度变大，字体会变得很大，影响ui效果；

### 对于编译成多端代码的理解

1. uni-app编译器<https://zh.uniapp.dcloud.io/tutorial/#%E7%BC%96%E8%AF%91%E5%99%A8>；
   1. 编译器运行在电脑开发环境。一般是内置在HBuilderX工具中，也可以使用独立的cli版。
   2. 开发者按uni-app规范编写代码，由编译器将开发者的代码编译生成每个平台支持的特有代码；
      1. 在微信小程序平台，编译器将.vue文件拆分生成wxml、wxss、js等代码；
   3. 语法分析，翻译为对应平台的代码规范，比如小程序的（wxml、wxss、json），h5直接不需要改变，app的weex语法等；
   4. 对应的配置文件，会转到对应的配置文件项中，如小程序下的 pages，app下的；
2. 运行时（runtime）<https://zh.uniapp.dcloud.io/tutorial/#%E8%BF%90%E8%A1%8C%E6%97%B6-runtime>；
   1. runtime不是运行在电脑开发环境，而是运行在真正的终端上。
   2. 在小程序端，uni-app的runtime，主要是一个小程序版的vue runtime，页面路由、组件、api等方面基本都是转义。
   3. uni-app runtime包括3部分：基础框架、组件、API。
      1. 在小程序端，uni-app基础组件会直接转义为小程序自己的内置组件。在小程序的runtime中不占体积。
      2. 也就是说，使用uni-app的标准API，可以跨端使用。但对于不跨端的部分，仍可以调用该端的专有API。由于常见的API都已经被封装内置，所以日常开发时，开发者只需关注uni标准API，当需要调用特色端能力时在条件编译里编写特色API调用代码。
3. 逻辑层和渲染层分离：
   1. 在web平台，逻辑层（js）和渲染层（html、css），都运行在统一的webview里；
   2. 但在小程序和app端，逻辑层和渲染层被分离了；
   3. 分离的核心原因是性能。过去很多开发者吐槽基于webview的app性能不佳，很大原因是js运算和界面渲染抢资源导致的卡顿；

### 小程序 ｜ App 嵌入h5的优缺点

1. 小程序原生，可以类比App的端：
   1. 优点：体验好，速度快；
   2. 缺点：**不灵活**，需要发包审核，包的体积会逐步增大；
   3. **存量 H5 的问题**：都改造成小程序的成本太高了；
2. 小程序+H5:
   1. 优点：灵活，工作量比较小；
   2. 缺点：**交互，通信成本高**；
   3. **存量 H5 的问题**：与 APP 功能耦合严重；
3. 多端编译，比如从头 taro/uni-app 开发；
   1. 优点：多端运行，多端性能都还可以；
   2. 缺点：api 兼容成本高，会进行很多判断，会有很多代码；
      1. 编译出来的结果不是特别理性，一是性能上面没有达到理想的状态，二是 api 在多端兼容上面二次改造的成本很高；
   3. **存量 H5 的问题**：与 APP 功能耦合严重；

## uni-app开发小程序端优化

### 视图层初级优化技巧

1. 骨架屏 + loading：
   1. 需要放在Page.onLoad到数据加载完成；
   2. 具体骨架屏文档：<https://developers.weixin.qq.com/miniprogram/dev/devtools/skeleton.html>；
   3. 一般只会在第一个页面使用，不过分使用骨架屏；
2. **优化长列表页面，向下滑动加载无穷**（滑动窗口）：
   1. recycle-view/recycle-item组件，适用于长列表的渲染，只展示能看到的；
      1. 设置top属性，动态撑起来；
3. 使用页面容器：
   1. page-container<https://developers.weixin.qq.com/miniprogram/dev/component/page-container.html>；
      1. “假页”容器组件，效果类似于 popup 弹出层，页面内存在该容器时，当用户进行返回操作，关闭该容器不关闭页面。
4. 重渲染与自定义组件优化；
   1. 减少setData的调用次数，合并setData；
   2. 将频繁变化的数据封装在一个个的单独的组件里边，同时去掉一些不必要的数据设置，减少每次setData传递的一个数据量；
5. 使用localStorage缓存接口数据；

### 打包优化

1. 分包；
2. 压缩；
3. tree-sharking；

### 首屏及逻辑层代码优化技巧

1. 代码按需注入与初始渲染缓存；
   1. 按需注入，仅渲染首屏需要的代码；
      1. `"lazyCodeLoading": "requiredComponents"`；
   2. 静态/动态初始渲染缓存 = 静态本地化的骨架屏；
      1. `"initialRendingCache": "static`；
2. [预加载页面](https://zh.uniapp.dcloud.io/api/preload-page.html#preloadpage)，是一种性能优化技术。被预载的页面，在打开时速度更快。
3. **使用独立分包和分包预下载**：
   1. [subPackages](https://zh.uniapp.dcloud.io/collocation/pages.html#subpackages)：分包加载配置，此配置为小程序的分包加载机制；
   2. [分包预载配置](https://zh.uniapp.dcloud.io/collocation/pages.html#preloadrule)，配置preloadRule后，在进入小程序某个页面时，由框架自动预下载可能需要的分包，提升进入后续分包页面时的启动速度；
4. 占位组件：
   1. 给自定义组件添加一个替身；
5. 小程序切换后台后，不再使用 setData；

### 对应开发工具的提示进行优化

使用微信开发者工具对小程序进行分析并进行相应调整：

1. 代码依赖分析；
2. 性能报告；
3. 代码质量扫描；
4. 调试区的Performance面板；
5. 体验评分；
6. memory面板；
   1. 静止的时候查看，如果内存仍旧变大，可能存在了内存泄漏的问题；
7. js profile面板；

## 常见的一些问题的处理

### 在 uni-app 中，可以有如下实现全局变量的方式

1. 本地存储
2. 配置文件
3. 挂载 Vue.prototype
4. globalData
   1. globalData 也不是动态响应的
   2. 需要在页面的 **onShow 生命周期**中获取 globalData 的值
   3. 对 globalData 的定义，需要在 App.vue 中进行
   4. getApp().globalData.userName = "诗圣"；设置
   5. this.author = getApp().globalData.userName;获取
5. Vuex，这个Vue通用；

### [uni.scss 的问题](https://zh.uniapp.dcloud.io/collocation/uni-scss.html)

1. uni.scss会编译到每个scss文件中，所有的文件都会被注入，随便添加一个页面就会变的很大，这里真的是个大坑，每一个页面、每一个组件的scss文件都被撑到几十Kb；
2. 原本只需要在全局引用一次的样式，被无数次重复注入在每一个样式文件里面，这里与Vue的区别在于小程序没有全局的变量；
3. 所以在不需要uni.scss里边的变量的时候，尽量减小这个文件的大小；

### 页面局部滚动的时候，需要获取这块的高度

```js
getScrollViewHeight() {
      const that = this;
      const screenHeight = uni.getSystemInfoSync().windowHeight;
      const query = wx.createSelectorQuery();
      query.select('.patients').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(function(res) {
        // res[0].top       // #the-id节点的上边界坐标
        // res[1].scrollTop // 显示区域的竖直滚动位置
        that.scrollViewHeight = res[0].height - 60 + 'px';
        console.log('getScrollViewHeight2', that.scrollViewHeight, res);
      });

      console.log('getScrollViewHeight', screenHeight);
    }
```

这里的策略就是，**首先滚动元素设置一个比较小的值，然后计算父级元素的自适应高度，然后根据这个高度来计算滚动元素的实际可控高度**。

### tab 跳转后刷新页面

参考操作的方式。

```js
uni.switchTab({
  url: '/pages/home/index',
  success() {
    let page = getCurrentPages().pop(); // 跳转页面成功之后
    if (!page) return;
    page.onLoad(); // 如果页面存在，则重新刷新页面
  },
});
```

### 小程序如何与 web-view 共享 cookie

1. 小程序与 web-view 与不能共享 cookie；
2. 小程序内嵌的 webview 页面与打开的公众号页面是共享 cookie 的，这样就会有串 token 的问题；
   1. 小程序中的 web-view 和微信中直接打开的 h5，**因为用的是同一个浏览器内核**，所以，**它们的 cookie、storage 是可以共享的**；
   2. 所以重新进入页面的时候需要重置 cookie；

### manifest.json 应用配置

1. manifest.json 文件是应用的配置文件，用于指定应用的名称、图标、权限等；
2. 在不同平台，会被提取生成不同的文件；
   1. 在微信小程序下，大多提取了`project.config.json`下；
   2. 在App下边，大多被提取到了`AndroidManifest.xml`下；

### 其他的一些问题

[参考我之前的文章](https://juejin.cn/post/6984369789942628366)；

## 总结

1. 使用uni-app开发小程序是比较合适的，学习成本也很低；
2. 使用uni-app开发成本也比较低，对开发资源不是很丰富的公司，是比较适合的，也为后续的一些可能的端的开发做了预留；
3. 使用uni-app单纯开发App的体验不是很好，体验效果相对于App原生开发也差了很多；
4. App与小程序有很多地方有差异，如果同时要兼容这两端，最好使用公共分支开发基础版本，然后分别打包，避免小程序和App分支相互合并；
5. 要提前分包，一般将公共部分及tab页面放在主包，其他的分模块进行分包；

## 参考文档

1. [uni-app](https://uniapp.dcloud.net.cn/)；
2. [组件](https://uniapp.dcloud.io/component/README?id=%e5%9f%ba%e7%a1%80%e7%bb%84%e4%bb%b6)
3. [项目示例，hello uni-app](https://hellouniapp.dcloud.net.cn/pages/component/view/view)
4. [微信小程序页面指定区域局部滚动、下拉刷新和触底加载](https://www.jianshu.com/p/caf03b79549c)
5. [uni-app 选型评估 23 问](https://uniapp.dcloud.io/select)
6. [文章](https://www.cnblogs.com/zhuanzhuanfe/p/9754482.html)

以上只是个人见解，请指教，[个人blog](https://github.com/qiuwww/blog/tree/master/0.5.JS/%E5%BC%82%E6%AD%A5%E7%BC%96%E7%A8%8B)。
