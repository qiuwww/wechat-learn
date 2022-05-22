# 如何实现 Vue 转小程序代码

1. [参考文章](https://www.bowencodes.com/post/vue-to-miniprogram-3)
2. [uni-app 是如何构建小程序的](https://juejin.cn/post/6968438754180595742)

## 二者的代码差异

1. 小程序的 page 和 component 都是由 wxml、js、wxss、json 四部分组成，实际上这种多文件的开发方式体验并不是很好，而 vue 采用的是单文件开发。
2. js 方面的差异：
    1. vue 中的 data 是一个函数，返回一个对象，而小程序中则直接是一个对象
    2. vue 中是在 component 属性中引入子组件，小程序是将子组件和路径写在 json 配置的 useComponents 中
    3. **vue 中 props 的默认值关键字为 value，小程序为 default**
    4. vue 和小程序的生命周期勾子函数名不一样
    5. **vue 中的 name 属性，小程序并不存在，需要删除**
    6. vue 中的代码使用 export default 输出，而小程序中则不需要，小程序使用的是直接用 component/page 包裹组件属性

## 如何做

1. parseHtml，解析出来 html 代码，对应到小程序的 wxml；
    1. 解析开始标签；
    2. 闭合标签；
    3. 标签属性；
    4. 字符内容；
2. 处理 vue 中 script 标签内 js 代码，将其转换为小程序可以解析的 js 文件代码，我借助了 babel 将代码转为 ast 树，然后对 ast 树进行一些处理，最后再转换为代码。主要用了以下几个库：
    1. @babel/parser：将代码转为 ast 树
    2. @babel/traverse：用来遍历 ast 树
    3. @babel/types：可以用作验证、构造 ast 节点
    4. @babel/template：以模版的形式生成 ast 节点，适用于生成复杂 ast 节点
    5. @babel/generator：将 ast 树再转换为代码；
