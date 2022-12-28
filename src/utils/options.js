import fs from 'fs-extra';
import path from 'path';
import { getAbsolutePath } from './getValue';
import { isDir } from './common';

export function verifyOptions(options = {}) {
  const {
    entryPath,
    outputPath,
    quality,
    customList,
    biggerWebpDelete,
    webpExistReplace,
    detailLog,
    cache
  } = options;

  if (!isDir(entryPath)) {
    throw new Error(`entryPath 不是一个有效的路径，收到--->${entryPath}`);
  }

  if (outputPath && typeof outputPath !== 'string') {
    throw new Error(`outputPath 不是一个有效的路径，收到--->${outputPath}`);
  }

  if (customList && !Array.isArray(customList)) {
    throw new Error('customList 必须是一个数组');
  }

  if (Array.isArray(customList)) {
    customList.forEach((item) => {
      if (typeof item !== 'object') {
        throw new Error('customList 子项不是有效值');
      }
    });
  }

  if (
    (quality && typeof quality !== 'number')
      || (typeof quality === 'number' && (quality > 100 || quality < 0))
  ) {
    throw new Error('quality 必须是0-100');
  }

  if (biggerWebpDelete && typeof biggerWebpDelete !== 'boolean') {
    throw new Error('biggerWebpDelete 只能是布尔值');
  }

  if (webpExistReplace && typeof webpExistReplace !== 'boolean') {
    throw new Error('webpExistReplace 只能是布尔值');
  }

  if (detailLog && typeof detailLog !== 'boolean') {
    throw new Error('detailLog 只能是布尔值');
  }

  if (cache && typeof cache !== 'boolean') {
    throw new Error('cache 只能是布尔值');
  }
}

export function getDefaultOutputPath(entryPath) {
  const lastDir = path.basename(entryPath);

  const webpDir = `${lastDir}-webp`;
  return entryPath.replace(lastDir, webpDir);
}

export function getCwebpOptions(webpParamas) {
  const cwebpOptions = [];
  const list = Object.keys(webpParamas);

  for (let index = 0; index < list?.length; index += 1) {
    let key = list[index];
    const currentVal = webpParamas[key];

    if (key === 'quality') {
      key = 'q';
    }

    // 忽略参数 o，输出path 已经在配置决定
    if (key === 'o') {
      continue;
    }

    // 值为 false 忽略
    if (currentVal === false || currentVal === 'false') {
      continue;
    }

    cwebpOptions.push('-' + key);

    // 值不是 true，压入选项的值
    if (currentVal && currentVal !== true && currentVal !== 'true') {
      cwebpOptions.push(currentVal);
    }
  }

  return cwebpOptions;
}

export function setDefaultPluginOptions(options = {}) {
  const {
    entryPath,
    outputPath,
    quality,
    customList = [],
    biggerWebpDelete,
    webpExistReplace,
    quiet,
    detailLog,
    cache,
    ...rest
  } = options;

  const currentCustomList = customList
    .filter((item) => {
      const { quality: q, path: itemPath } = item;
      if (!itemPath || q === quality) return false;
      return true;
    })
    .map((item) => ({
      ...item,
      path: getAbsolutePath(item.path)
    }));

  const enryAbPath = getAbsolutePath(entryPath);

  return {
    entryPath: enryAbPath,
    outputPath: outputPath
      ? getAbsolutePath(outputPath)
      : getDefaultOutputPath(enryAbPath),
    customList: currentCustomList,
    quality: quality ?? 75,
    biggerWebpDelete: biggerWebpDelete ?? true,
    webpExistReplace: webpExistReplace ?? false,
    quiet: quiet ?? true,
    detailLog: detailLog ?? false,
    cache: cache ?? false,
    ...rest
  };
}

export function getCurrentOptions(options = {}) {
  verifyOptions(options);

  const {
    entryPath,
    outputPath,
    quality,
    customList,
    biggerWebpDelete,
    webpExistReplace,
    quiet,
    detailLog,
    cache,
    ...rest
  } = setDefaultPluginOptions(options);

  // 本工具用的参数
  const pluginOptions = {
    entryPath,
    outputPath,
    quality,
    customList,
    biggerWebpDelete,
    webpExistReplace,
    detailLog,
    cache
  };

  const webpParamas = {
    quality,
    quiet: quiet,
    ...rest
  };

  return {
    cwebpOptions: webpParamas,
    pluginOptions
  };
}

export function getImgCustomCwebpConfig(currentPath, customList) {
  for (let index = 0; index < customList?.length; index += 1) {
    const item = customList[index];
    const { path: itemPath, ...rest } = item;
    if (currentPath === itemPath) {
      return rest;
    }
  }
  return {};
}

export function getOutputPathByEntry(originImgPath, { entryPath, outputPath }) {
  return originImgPath.replace(entryPath, outputPath);
}

export function getWebpTransformPath(originImgPath, { entryPath, outputPath }) {
  const extname = path.extname(originImgPath);
  let resultPath = getOutputPathByEntry(originImgPath, {
    entryPath,
    outputPath
  }).replace(new RegExp(`\\${extname}$`), '.webp');

  resultPath = getAbsolutePath(resultPath);
  const dirPath = path.dirname(resultPath);

  fs.ensureDirSync(dirPath); // 确保路径存在

  return resultPath;
}
