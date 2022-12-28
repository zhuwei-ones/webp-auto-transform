import { execFileSync } from 'child_process';
import cwebp from 'cwebp-bin';
import { pathExistsSync, removeSync } from 'fs-extra';
import {
  errLog,
  getCwebpOptions,
  getImgCustomCwebpConfig,
  getSizeDifference,
  getWebpTransformPath,
  getHumanFileSize,
  logTransformDetail, saveTransformLog,
  isWebpCacheExist,
  addBiggerWebpCache,
  removeBiggerWebpCache,
  writeTransformInfoToFile
} from '../../utils';

function createWebp({ path: imgPath, bar, forceCreate }) {
  const { cwebpOptions, pluginOptions } = this.options;

  const {
    entryPath,
    outputPath,
    biggerWebpDelete,
    webpExistReplace,
    customList,
    cache
  } = pluginOptions;

  const webpPath = getWebpTransformPath(imgPath, { entryPath, outputPath });
  const customCwebpConfig = getImgCustomCwebpConfig(imgPath, customList);

  const currentCwebpOptions = getCwebpOptions({
    ...cwebpOptions,
    ...customCwebpConfig
  });

  // 如果强制重建，就不需要检测是否存在
  if (!forceCreate) {
    bar?.tick?.();
    logTransformDetail(imgPath, webpPath);

    // 缓存了转换后更大的图片，不再对这些图片做二次转换，提升速度
    if (cache && biggerWebpDelete && isWebpCacheExist(imgPath)) {
      saveTransformLog(`[skip transform] ${imgPath} was transformed to webp, and it was bigger, so it will not transform again, you can check the cachelog [.webp-transform.log]`);
      return;
    }

    // 已经存在webp，但是设置不替换
    if (
      pathExistsSync(webpPath)
      && !webpExistReplace
    ) {
      saveTransformLog(`[exist webp] ${imgPath} exist webp, it will not transfrom to webp again`);
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

  // 如果原图更小，那么直接使用原图
  if (diffSize > 0 && biggerWebpDelete) {
    removeSync(webpPath);
    addBiggerWebpCache(imgPath);
    saveTransformLog(`[delete bigger webp] ${imgPath}， 原：${getHumanFileSize(originSize)}， webp：${getHumanFileSize(webpSize)}`);
  } else {
    removeBiggerWebpCache(imgPath);
    saveTransformLog(`[create webp successful] ${imgPath}， 缩小了 ${ getHumanFileSize(Math.abs(diffSize)) }，  原：${getHumanFileSize(originSize)}，  webp：${getHumanFileSize(webpSize)}`);
  }

  logTransformDetail(imgPath, webpPath);
  writeTransformInfoToFile();
}

export default createWebp;
