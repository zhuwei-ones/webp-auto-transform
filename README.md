

## WebpAutoTransform
[![Coverage Status](https://zhuwei-ones.github.io/webp-auto-transform/badges.svg)](https://zhuwei-ones.github.io/webp-auto-transform/lcov-report/)

## Features

1. 支持批量把图片转换成webp，转换之后更大支持删除   
2. 监听图片的新增/删除/修改/移动，从而动态转换webp  
3. 支持cli，使用终端命令进行一次性批量转换
4. 支持日志查看转换的详情信息


## Install

```sh
npm install webp-auto-transform
```


## Usage

```js
const webpAutoTransform = require("webp-auto-transform")

webpAutoTransform({
    entryPath:"./assets/images",
    outputPath:"./assets/images-webp",
    quality:75, // 75 is default value
    customList:[ // 针对个别图片做定制化
        {
             path:"./assets/images/1.png",
             quality:100
        },
        {
             path:"./assets/images/2.png",
             quality:90
        }
    ],
    biggerWebpDelete: true， // 转换后更大的webp 图片处理方式， 删除 还是保留，默认删除
    webpExistReplace: true  // 如果webp文件已经存在，是否替换
    detailLog:false // 是否输出转换信息到控制台中，当前已经会把转换日志输出到 .webp-transform.log 文件中
    cache:false // 是否缓存转换信息，开启之后，之前转换更大的webp 被删除之后会被记录下来，重新执行的时候不会再转换该图片

    // ...其他 cwebp 支持的参数，参考https://developers.google.com/speed/webp/docs/cwebp
    lossless:true,
    alpha_q:9
})

```


### Options
- `quality` 压缩因素，默认75，0-100
- `entryPath` 图片文件入口 ,./assets/images
- `outputPath` webp 输出路径 ，./assets/images-webp，可以不填，默认生成在 entryPath 最后一个文件夹加上 “-webp”
- `customList` 针对单个图片进行参数配置，例如压缩因素 quality 为了针对某些需要更高清晰度的图片
    ```js
    [{
        path:"./assets/images/1.png",
        quality:0-100
    }]
    ```
- `biggerWebpDelete`,转换后更大的webp 图片处理方式， 删除 还是保留，默认删除，默认 ture，false 则会保留图片
- `webpExistReplace`,如果webp文件已经存在，是否替换,默认 false
- `cache`,开启之后，之前转换更大的webp 被删除之后会被记录下来，重新执行的时候会被过滤，不会再转换该图片
- `....more` ，cwebp 支持的参数，参考 https://developers.google.com/speed/webp/docs/cwebp


## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/zhuwei-ones/webp-auto-transform/graphs/contributors">
  <img src="https://zhuwei-ones.github.io/webp-auto-transform/CONTRIBUTORS.svg" />
</a>

Made with [github-action-contributors](https://github.com/jaywcjlove/github-action-contributors).