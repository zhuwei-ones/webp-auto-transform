import { pathExistsSync, statSync } from 'fs-extra';
import { resolve } from 'path';
import { glob } from 'glob';
import { imgExt, CWD } from '../lib/const';

export function getDirAllFile(dirPath) {
  const files = glob.sync(dirPath);
  return files;
}

export function getWatchDirAllFiles(dirPath) {
  return getDirAllFile(`${dirPath}/**/*.+(${imgExt})`);
}

export function getSizeDifference(imgPath, webpPath) {
  const statsOrigin = pathExistsSync(imgPath) && statSync(imgPath);
  const statsWebp = pathExistsSync(webpPath) && statSync(webpPath);

  const oSize = statsOrigin?.size || 0;
  const rSize = statsWebp?.size || 0;
  const diff = (rSize - oSize);

  return {
    originSize: Number(oSize.toFixed(2)),
    webpSize: Number(rSize.toFixed(2)),
    diffSize: Number(diff.toFixed(2))
  };
}

export function getAbsolutePath(_path) {
  return resolve(CWD, _path);
}

export function getHumanFileSize(bytes, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024;

  let newByte = bytes;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    newByte /= thresh;
    u += 1;
  } while (Math.round(Math.abs(newByte) * r) / r >= thresh && u < units.length - 1);

  return newByte.toFixed(dp) + ' ' + units[u];
}
