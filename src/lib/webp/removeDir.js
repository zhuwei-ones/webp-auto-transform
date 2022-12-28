import { pathExistsSync, removeSync } from 'fs-extra';
import { getOutputPathByEntry, saveTransformLog } from '../../utils';

function removeDir({ path: dirPath }) {
  const { pluginOptions: { entryPath, outputPath, detailLog } } = this.options;

  const webpDirPath = getOutputPathByEntry(dirPath, { entryPath, outputPath });

  if (pathExistsSync(webpDirPath)) {
    removeSync(webpDirPath);

    if (detailLog) {
      saveTransformLog(`[delete directory] ${dirPath} `);
    }
  }
}

export default removeDir;
