# 小程序多 webview 崩溃的问题

## 整体分析

yarn analyzer

初步感觉是占用内存太大导致的微信崩溃。

## 图片标签压缩 `<image>`，加载资源的时候进行压缩

`https://help.aliyun.com/document_detail/44688.html?spm=a2c4g.11186623.6.747.159658cdGO4e3B`

- ?x-oss-process=image/resize,w_100/quality,q_80
- ?x-oss-process=image/resize,w_86

## 首页的时候，预先加载会员页面的资源

## 打包命令整理一下

1. 开发预览
2. 打包上传

## webview 加载过程白屏的问题

1. 添加一个 url 加载完成的页面，加载完成了就替换一下
