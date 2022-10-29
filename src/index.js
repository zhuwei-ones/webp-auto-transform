import { getCurrentOptions } from './lib/utils';
import watchFile from './lib/watch';

function WebpAutoTransform(options) {
  const currentOptions = getCurrentOptions(options);

  return watchFile(currentOptions);
}

module.exports = WebpAutoTransform;
