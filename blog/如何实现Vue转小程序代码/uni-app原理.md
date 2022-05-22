# uni-app 原理

uni-app 的源码主要包括三方面:

1. webpack。webpack 是前端常用的一个模块打包器，uni-app 构建过程中，会将 Vue SFC 的 template、script、style 三段式的结构，编译成小程序四段式结构，以字节小程序为例，会得到 ttml、ttss、js、json 四种文件。
2. 编译器。uni-app 的编译器本质是把 Vue 的视图编译成小程序的视图，即把 template 语法编译成小程序的 ttml 语法，之后，uni-app 不会维护视图层，视图层的更新完全交给小程序自身维护。但是 uni-app 是使用 Vue 进行开发的，那 Vue 跟小程序是怎么交互的呢？这就依赖于 uni-app 的运行时。
3. 运行时。运行时相当于一个桥梁，打通了 Vue 和小程序。小程序视图层的更新，比如事件点击、触摸等操作，会经过运行时的事件代理机制，然后到达 Vue 的事件函数。而 Vue 的事件函数触发了数据更新，又会重新经过运行时，触发 setData，进一步更新小程序的视图层。
