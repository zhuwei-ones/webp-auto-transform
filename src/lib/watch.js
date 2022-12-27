import {
  getWatchDirAllFiles, isValidImg, log
} from './utils';
import chokidar from 'chokidar';
import WebpInit, { CreateWebpEventName, RemoveDirEventName, RemoveWebpEventName } from './webp';
import ProgressBar from 'progress';
import { saveTransformLog } from './log';

function watchFile(options) {
  const { pluginOptions: { entryPath } } = options;
  const event = WebpInit(options);

  const allFiles = getWatchDirAllFiles(entryPath);
  const bar = new ProgressBar(':bar :current/:total', { total: allFiles.length });

  return chokidar
    .watch(entryPath)
    .on('add', (path) => {
      if (!isValidImg(path)) {
        return;
      }
      event.emit(CreateWebpEventName, { path, bar });
    })

    // 图片直接被替换（不是删除再添加）
    .on('change', (path)=>{
      if (!isValidImg(path)) {
        return;
      }
      event.emit(CreateWebpEventName, { path, bar, forceCreate: true });
    })
    .on('unlink', (path) => {
      if (!isValidImg(path)) {
        return;
      }
      event.emit(RemoveWebpEventName, { path });
    })
    .on('unlinkDir', (path) => {
      event.emit(RemoveDirEventName, { path });
    })
    .on('error', (e) => {
      log(`监听发生了错误 ${e.message}`);
      saveTransformLog(`监听发生了错误 ${e.message}`);
    });
}

export default watchFile;
