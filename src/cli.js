// import createWebp from './webp/createWebp';

import ProgressBar from 'progress';
import { getCurrentOptions, getWatchDirAllFiles, isValidImg } from './utils';
import WebpInit, { CreateWebpEventName } from './lib/webp';

function getAllImgs(entryPath) {
  const allFiles = getWatchDirAllFiles(entryPath);

  return allFiles;
}

function transformWebpBatch(options) {
  const currentOptions = getCurrentOptions(options);
  const {
    pluginOptions: { entryPath }
  } = currentOptions;

  const event = WebpInit(currentOptions);
  const imgList = getAllImgs(entryPath);

  const bar = new ProgressBar(':bar :current/:total', {
    total: imgList.length
  });

  imgList.forEach((img) => {
    if (!isValidImg(img)) {
      return;
    }
    event.emit(CreateWebpEventName, { path: img, bar, forceCreate: true });
  });
}

export default transformWebpBatch;
