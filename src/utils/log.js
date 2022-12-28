import path from 'path';
import { writeFileSync } from 'fs-extra';
import chalk from 'chalk';
import { format } from 'util';
import { getBiggerWebpCacheList } from './cache';
import { debounce, isTestEnv } from './common';
import {
  getSizeDifference, getHumanFileSize
} from './getValue';

let cache = {};

export function getLogPrefix(name = '') {
  return `[webp-auto-transform ${name}]: `;
}

export function log(...args) {
  // 跑测试用例不需要打印
  if (isTestEnv()) {
    return;
  }
  console.log(chalk.blue(getLogPrefix('log')), ...args);
}

export function errLog(...args) {
  // 跑测试用例不需要打印
  if (isTestEnv()) {
    return;
  }
  console.log(chalk.blue(getLogPrefix('error')), ...args);
}

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
    原图片包大小: getHumanFileSize(totalSize),
    webp图片包大小: getHumanFileSize(totalWebpSize),
    未压缩图片包大小: getHumanFileSize(remainSize),
    总共减少体积: getHumanFileSize(diffSize),
    总共压缩图片数: imgList.length,
    压缩率: `${(Number(rate) * 100).toFixed(2)}%`
  });

  const biggerList = getBiggerWebpCacheList();

  if (biggerList.length) {
    log(`根据缓存，为了提升转换速度，本次跳过了 ${biggerList.length} 张图片的转换，跳过的图片可以看 [.webp-transform.cache] `);
  }

  log(`本次共有 ${biggerCounts} 张图片转成 webp 后会更大，转换详情请查看根目录日志文件 [.webp-transform.log]`);
}, 1000);

// 输出转换之后的对比
export const logTransformDiff = (imgInfo) => {
  // 跑测试用例不需要打印
  if (isTestEnv()) {
    return;
  }
  cache[imgInfo.originPath] = imgInfo;
  logDetail();
};

export function logTransformDetail(imgPath, webpPath) {
  const { originSize, webpSize } = getSizeDifference(imgPath, webpPath);

  logTransformDiff({
    originSize,
    originPath: imgPath,
    webpSize,
    webpPath
  });
}
