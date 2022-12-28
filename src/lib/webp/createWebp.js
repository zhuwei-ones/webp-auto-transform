import { execFileSync } from 'child_process';
import cwebp from 'cwebp-bin';
import { pathExistsSync, removeSync } from 'fs-extra';
import { logTransformDetail, saveTransformLog } from '../log';
import {
  errLog,
  getCwebpOptions,
  getImgCustomCwebpConfig,
  getSizeDifference,
  getWebpTransformPath,
  getHumanFileSize
} from '../utils';

function createWebp({ path: imgPath, bar, forceCreate }) {
  const { cwebpOptions, pluginOptions } = this.options;

  const {
    entryPath,
    outputPath,
    biggerWebpDelete,
    webpExistReplace,
    customList
  } = pluginOptions;

  const webpPath = getWebpTransformPath(imgPath, { entryPath, outputPath });
  const customCwebpConfig = getImgCustomCwebpConfig(imgPath, customList);

  const currentCwebpOptions = getCwebpOptions({
    ...cwebpOptions,
    ...customCwebpConfig
  });

  // 如果强制重建，就不需要检测是否存在
  if (!forceCreate) {
    // 已经存在webp，但是设置不替换
    if (
      pathExistsSync(webpPath)
      && !webpExistReplace
    ) {
      bar?.tick?.();
      saveTransformLog(`[create webp failed] ${imgPath} exist webp, it will not transfrom to webp again`);
      logTransformDetail(imgPath, webpPath);
      return;
    }
  }

  try {
    execFileSync(cwebp, [...currentCwebpOptions, imgPath, '-o', webpPath]);
  } catch (error) {
    const msg = `[create webp failed] ${imgPath} 转换 webp 失败，错误详情--->${error.message}, 检查配置是否出错---> ${JSON.stringify(cwebpOptions, null, 2)}`;
    errLog(msg);
    saveTransformLog(msg);
  } finally {
    bar?.tick?.();
  }

  const { diffSize, originSize, webpSize } = getSizeDifference(imgPath, webpPath);

  logTransformDetail(imgPath, webpPath);

  // 如果原图更小，那么直接使用原图
  if (diffSize > 0 && biggerWebpDelete) {
    removeSync(webpPath);
    saveTransformLog(`[delete bigger webp ] ${imgPath}， 原：${getHumanFileSize(originSize)}， webp：${getHumanFileSize(webpSize)}`);
  } else {
    saveTransformLog(`[create webp successful] ${imgPath}， 缩小了 ${ getHumanFileSize(Math.abs(diffSize)) }，  原：${getHumanFileSize(originSize)}，  webp：${getHumanFileSize(webpSize)}`);
  }
}

export default createWebp;
