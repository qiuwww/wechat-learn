# uniapp小程序的优化

参考：<https://developers.weixin.qq.com/community/business/course/000606628dc2e86dc0ddcbb115940d>

所有的优化要点，都是建立在小程序的运行机制和启动流程上。

## 小程序双线程运行机制

1. 视图层，webview；
   1. wxs，可以独立的在视图层运行，而不需要逻辑层；
   2. 重渲染机制，wxss节点越少，嵌套越少，渲染效率越高；
      1. 节点要小于1000个，层数要小于30层；
2. 逻辑层，jsCore；
   1. 借助wxWebAssembly的原理，使用编译型语言，如c，go等来替代解释性语言（运行时）JS，从而来提高性能；
3. native层，用于以上两者进行通信；
   1. WexinJSBridge；
   2. setData，传递的数据不能超过256kb，超过就会卡顿；
   3. 频繁的调用setData，也会出现明显的卡顿现象；

只有逻辑层和视图层代码全部注入后，并且时间点对齐后，才会开始第三阶段首屏渲染的工作。

## 打包优化

1. 分包；
2. 压缩；
3. tree-sharking；

## 性能优化，可以理解为小程序的优化

从打开到首页展示完全，到onReady。

1. 虚拟dom，优化长列表，优化加载（逐步加载），借助requestAnimationRequest来做；
2. 优化一些动画展示；
3. 小程序首页白屏；
4. 小程序跳转点击延迟动作；
5. 列表越往下滑动，越卡；
6. 小程序预加载机制；
7. 紧跟小程序基础库版本；
8. 数据预拉取；
9. 分页渲染、虚拟dom；
10. localStorage存储本地数据；
11. http2提高传输效率；
12. 本地图片转为网络图片；

### 代码诊断，发现性能问题的原因来自于哪里

1. 代码依赖分析；
2. 性能报告；
3. 代码质量扫描；
4. 调试区的Performance面板；
5. 体验评分；
6. memory面板；
   1. 静止的时候查看，如果内存仍旧变大，可能存在了内存泄漏的问题；
7. js profile面板；

## 小程序启动方式

1. 冷启动
   1. App启动生命周期
      1. onLaunch
      2. onLoad
      3. onReady
         1. 在其之前，使用骨架屏技术可以提高展示效率；
   2. Page的生命周期
2. 热启动
   1. 30min以内，再次进入前台；

## 视图层初级优化技巧

1. 骨架屏 + loading：
   1. 需要放在Page.onLoad到数据加载完成；
   2. 具体骨架屏文档：<https://developers.weixin.qq.com/miniprogram/dev/devtools/skeleton.html>；
   3. 一般只会在第一个页面使用，不过分使用骨架屏；
2. **优化长列表页面，向下滑动加载无穷**（滑动窗口）；
   1. recycle-view/recycle-item组件，适用于长列表的渲染，只展示能看到的；
      1. 设置top属性，动态撑起来；
3. 使用页面容器；
   1. page-container<https://developers.weixin.qq.com/miniprogram/dev/component/page-container.html>；
      1. “假页”容器组件，效果类似于 popup 弹出层，页面内存在该容器时，当用户进行返回操作，关闭该容器不关闭页面。
4. 优化视图页动画效果；
5. 重渲染与自定义组件优化；
   1. 减少setData的调用次数，合并setData；
   2. 将频繁变化的数据封装在一个个的单独的组件里边，同时去掉一些不必要的数据设置，减少每次setData传递的一个数据量；

## 首屏及逻辑层代码优化技巧

1. 代码按需注入与初始渲染缓存；
   1. 按需注入，仅渲染首屏需要的代码；
      1. `"lazyCodeLoading": "requiredComponents"`；
   2. 占位组件；
   3. 静态/动态初始渲染缓存 = 静态本地化的骨架屏；
      1. `"initialRendingCache": "static`；
2. 使用独立分包和分包预下载；
3. 占位组件；
   1. 给自定义组件添加一个替身；
4. 小程序切换后台后，不再使用 setData；
