import { debounce, humanFileSize, log } from './utils';
import path from 'path';
import { writeFileSync } from 'fs-extra';
import { format } from 'util';

let cache = {};

export const saveTransformLog = (...args) => {
  var devLogFile = path.join(process.cwd(), '.webp-transform.log');
  var devLogOptions = { flag: 'a+' };

  const logInfo = format.apply(null, [...args, `， 时间：${new Date().toLocaleString()}`]) + '\n';

  writeFileSync(devLogFile, logInfo, devLogOptions, ()=>{});
};

const logDetail = debounce(() => {
  const currentImgList = cache;

  let totalSize = 0;
  let totalWebpSize = 0;
  let remainSize = 0;

  let biggerCounts = 0;
  const imgList = Object.keys(currentImgList);

  imgList.forEach((imgPath) => {
    const item = currentImgList[imgPath];
    const { originSize, webpSize } = item;

    if (webpSize > originSize) {
      biggerCounts += 1;
      remainSize += parseInt(originSize, 10);
    } else {
      // 只有更小的webp 才需要计算
      totalWebpSize += parseInt(webpSize, 10);
    }

    totalSize += parseInt(originSize, 10);
  });

  const diffSize = totalSize - remainSize - totalWebpSize;
  const rate = (diffSize / totalSize).toFixed(2);

  console.table({
    原图片包大小: humanFileSize(totalSize),
    webp图片包大小: humanFileSize(totalWebpSize),
    未压缩图片包大小: humanFileSize(remainSize),
    总共减少体积: humanFileSize(diffSize),
    总共压缩图片数: imgList.length,
    压缩率: `${(Number(rate) * 100).toFixed(2)}%`
  });

  log(`本次共有 ${biggerCounts} 张图片转成 webp 后会更大，转换详情请查看根目录日志文件 [.webp-transform.log]`);
}, 1000);

// 输出转换之后的对比
export const logTransformDiff = (imgInfo) => {
  // 跑测试用例不需要打印
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  cache[imgInfo.originPath] = imgInfo;
  logDetail();
};
