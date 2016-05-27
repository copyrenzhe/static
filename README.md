# static

## 前端静态资源库

### 使用
 执行命令：
```bash
git clone https://github.com/copyrenzhe/static.git
cd static
npm install -g gulp
npm install
```

### 介绍
>使用[gulp](https://github.com/gulpjs/gulp) 处理构建
>运行：
>  gulp --dev       *以开发模式生成app.js 和app.css*
>  gulp             *以生产模式生成*
>  gulp script      *只处理js相关*
>  gulp less        *编译less*
>  gulp watch --dev *监听文件变化，并立刻使用script或less进行处理*

### 目录
* dist: 工程
    * css
    * fonts
    * images
    * js
    * thirdparty
* src: 源码
    * css
    * fonts
    * images
    * js
        * lib *核心模块*
        * other *一些第三方插件*
        * plugin *主要插件*
    * less
    * thirdparty
* demo: demo目录，包含各个组件的测试页


### 主要插件
* dropdown  *bootstrap.dropdown模块*
* focusInput
* lazyload *延迟加载*
* jquery.validate *jquery表单验证*
* jquery.qrcode  *二维码生成*
* pagination  *分页*
* jquery.picbox  *jquery lightbox*