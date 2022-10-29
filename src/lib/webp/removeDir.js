import { pathExistsSync, removeSync } from 'fs-extra';
import { getOutputPathByEntry, log } from '../utils';

function removeDir(dirPath) {
  const { pluginOptions: { entryPath, outputPath, detailLog } } = this.options;

  const webpDirPath = getOutputPathByEntry(dirPath, { entryPath, outputPath });

  if (pathExistsSync(webpDirPath)) {
    removeSync(webpDirPath);

    if (detailLog) {
      log(`${dirPath} remove`);
    }
  }
}

export default removeDir;
