# uniapp将Vue转小程序的原理

Vue是template、script、style三段式的SFC，uni-app是怎么把SFC拆分成小程序的ttml、ttss、js、json四段式。

## 编译器

1. 编译器的原理其实就是通过ast的语法分析，把vue的template语法转换为小程序的ttml语法。
2. uni-app提供了一个运行时uni-app runtime，打包到最终运行的小程序发行代码中，该运行时实现了Vue.js 和小程序两系统之间的数据、事件同步。