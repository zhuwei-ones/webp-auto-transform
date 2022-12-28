import {
  ensureFileSync, pathExistsSync, readFileSync, writeJSONSync
} from 'fs-extra';
import { remove } from 'lodash';
import { debounce } from './common';
import { getAbsolutePath } from './getValue';
import { errLog, log } from './log';

const cacheFileName = '.webp-transform.cache';
const filePath = getAbsolutePath(cacheFileName);

let WebpCache = {
  BiggerDeleteList: []
};

function readTransformFromFile() {
  try {
    if (pathExistsSync(filePath)) {
      const content = readFileSync(filePath);

      const currentContent = content.toString();

      if (currentContent) {
        const cacheData = JSON.parse(currentContent);
        return cacheData;
      }
    }

    ensureFileSync(filePath);

    return [];
  } catch (error) {
    errLog('缓存写入出错');
    return [];
  }
}

export const writeTransformInfoToFile = debounce(()=>{
  ensureFileSync(filePath);
  writeJSONSync(filePath, WebpCache.BiggerDeleteList, { spaces: 4 });

  log('已经把转换后更大的图片缓存了，这些图片不会再下次转换中执行');
}, 1000);

export function addBiggerWebpCache(path) {
  if (!WebpCache.BiggerDeleteList.includes(path)) {
    WebpCache.BiggerDeleteList.push(path);
  }
}

export function removeBiggerWebpCache(path) {
  remove(WebpCache.BiggerDeleteList, (item)=>{
    return item === path;
  });
}

export function getBiggerWebpCacheList() {
  if (WebpCache.BiggerDeleteList.length === 0) {
    WebpCache.BiggerDeleteList = readTransformFromFile();
  }

  return WebpCache.BiggerDeleteList;
}

export function isWebpCacheExist(path) {
  const list = getBiggerWebpCacheList();
  return list.includes(path);
}
