import watchFile from './lib/watch';
import { getCurrentOptions } from './utils';

function WebpAutoTransform(options) {
  const currentOptions = getCurrentOptions(options);

  return watchFile(currentOptions);
}

module.exports = WebpAutoTransform;
