import fs from 'fs-extra';
import { regIsImg } from '../lib/const';

export function isTestEnv() {
  return process.env.NODE_ENV === 'test';
}

export function isValidImg(imgPath) {
  return regIsImg.test(imgPath);
}

export function isDir(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

export function debounce(cb, delay = 250) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

export function nextTickWrapper(fn) {
  return function wrapper(...args) {
    return process.nextTick(()=>{
      fn.call(this, ...args);
    });
  };
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
