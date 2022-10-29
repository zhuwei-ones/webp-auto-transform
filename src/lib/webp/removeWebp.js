import { removeSync } from 'fs-extra';
import { getWebpTransformPath, log } from '../utils';

function removeWebp(imgPath) {
  const { pluginOptions: { entryPath, outputPath, detailLog } } = this.options;

  const webpPath = getWebpTransformPath(imgPath, { entryPath, outputPath });

  removeSync(webpPath);

  if (detailLog) {
    log(`${webpPath} remove`);
  }
}

export default removeWebp;
