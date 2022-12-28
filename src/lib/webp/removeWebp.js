import { removeSync } from 'fs-extra';
import { getWebpTransformPath, saveTransformLog } from '../../utils';

function removeWebp({ path: imgPath }) {
  const { pluginOptions: { entryPath, outputPath, detailLog } } = this.options;

  const webpPath = getWebpTransformPath(imgPath, { entryPath, outputPath });

  removeSync(webpPath);

  if (detailLog) {
    saveTransformLog(`[delete webp] ${webpPath} `);
  }
}

export default removeWebp;
