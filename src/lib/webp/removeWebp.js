import { removeSync } from 'fs-extra';
import { saveTransformLog } from '../log';
import { getWebpTransformPath } from '../utils';

function removeWebp(imgPath) {
  const { pluginOptions: { entryPath, outputPath, detailLog } } = this.options;

  const webpPath = getWebpTransformPath(imgPath, { entryPath, outputPath });

  removeSync(webpPath);

  if (detailLog) {
    saveTransformLog(`[delete webp] ${webpPath} `);
  }
}

export default removeWebp;
