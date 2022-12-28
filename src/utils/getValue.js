import { statSync } from 'fs-extra';
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
  const statsOrigin = statSync(imgPath);
  const statsWebp = statSync(webpPath);

  const oSize = statsOrigin.size;
  const rSize = statsWebp.size;
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
