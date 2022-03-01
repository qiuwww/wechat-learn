# Steps

## 创建基础项目 mp

```bash
$ vue create -p dcloudio/uni-preset-vue uni-app-base
$ 选择默认模板
```

## 创建 npm 包项目

```bash
$ mkdir mp-h5-adapt && cd mp-h5-adapt
$ npm init
```

### 本地发布&安装

```bash
$ npm link
# 需要运行的仓库内，npm link uni-app-base
```

## uni 的条件编译
