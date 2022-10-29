

const WebpAutoTransform = require("../dist/index")

WebpAutoTransform({
    entryPath:"./images",
    outputPath:"./images-webp",

    quality:75, // 75 is default value
    customList:[  // 针对个别图片做定制化
        {
            path:"./images/optimize.png",
            quality:90
        }
    ] ,
    biggerWebpDelete: true, // 转换后更大的webp 图片处理方式， 删除 还是保留，默认删除
    webpExistReplace: true , // 如果webp文件已经存在，是否替换

    // ...其他 cwebp 支持的参数，参考https://developers.google.com/speed/webp/docs/cwebp
    lossless:true,
    alpha_q:9
})