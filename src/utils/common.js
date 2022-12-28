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

export function sleep(time = 200) {
  return new Promise((res)=>{
    setTimeout(()=>{
      res('');
    }, time);
  });
}
