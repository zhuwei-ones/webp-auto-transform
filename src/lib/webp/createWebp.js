import chalk from 'chalk';
import { execFileSync } from 'child_process';
import cwebp from 'cwebp-bin';
import { pathExistsSync, removeSync } from 'fs-extra';
import { basename } from 'path';
import { logTransformDiff } from '../log';
import {
  errLog,
  getCwebpOptions,
  getImgCustomCwebpConfig,
  getLogPrefix,
  getSizeDifference,
  getWebpTransformPath,
  humanFileSize,
  log
} from '../utils';

function logTransformDetail(imgPath, webpPath) {
  const { originSize, webpSize } = getSizeDifference(imgPath, webpPath);

  logTransformDiff({
    originSize,
    originPath: imgPath,
    webpSize,
    webpPath
  });
}

function createWebp(imgPath, bar) {
  const { cwebpOptions, pluginOptions } = this.options;

  const {
    entryPath,
    outputPath,
    biggerWebpDelete,
    webpExistReplace,
    customList,
    detailLog
  } = pluginOptions;

  const webpPath = getWebpTransformPath(imgPath, { entryPath, outputPath });
  const customCwebpConfig = getImgCustomCwebpConfig(imgPath, customList);

  const currentCwebpOptions = getCwebpOptions({
    ...cwebpOptions,
    ...customCwebpConfig
  });

  // 已经存在webp，但是设置不替换
  if (
    pathExistsSync(webpPath)
    && !webpExistReplace
  ) {
    bar?.tick?.();
    logTransformDetail(imgPath, webpPath);
    return;
  }

  try {
    execFileSync(cwebp, [...currentCwebpOptions, imgPath, '-o', webpPath]);
  } catch (error) {
    errLog(`${imgPath} 转换 webp 失败, 检查配置是否出错->`, cwebpOptions);
  } finally {
    bar?.tick?.();
  }

  const { diffSize } = getSizeDifference(imgPath, webpPath);
  const webpName = basename(webpPath);

  logTransformDetail(imgPath, webpPath);

  // 如果原图更小，那么直接使用原图
  if (diffSize > 0 && biggerWebpDelete) {
    removeSync(webpPath);

    if (detailLog) {
      console.log(
        chalk.red(getLogPrefix('delete webp')),
        webpName,
        `转换体积大了 ${ humanFileSize(diffSize) }`
      );
    }
  } else if (detailLog) {
    log(`${webpName} created`);
  }
}

export default createWebp;
