import createWebp from '../src/lib/webp/createWebp';
import fs, { emptyDirSync, removeSync } from 'fs-extra';
import removeWebp from '../src/lib/webp/removeWebp';
import path from 'path';
import { getAbsolutePath } from '../src/lib/utils';

const entryPath = './example/images';
const outputPath = './example/images-webp-test';

const currentCwd = process.cwd();

const entryAbPath = path.resolve(currentCwd, entryPath);
const outputAbPath = path.resolve(currentCwd, outputPath);

const img = path.resolve(entryAbPath, 'test.png');
const imgBig = path.resolve(entryAbPath, 'big.png');

const webp = path.resolve(outputAbPath, 'test.webp');
const webpBig = path.resolve(outputAbPath, 'big.webp');

fs.ensureDirSync(outputAbPath);

const context = {
  options: {
    // 这里是方法单元测试，不能传入相对路径，因为没有经过里面的方法处理，处理之后是绝对路径
    pluginOptions: { entryPath: getAbsolutePath(entryPath), outputPath: getAbsolutePath(outputPath) },
    cwebpOptions: {}
  }
};

const contextWithCwebParams = {
  options: {
    pluginOptions: {
      entryPath: getAbsolutePath(entryPath),
      outputPath: getAbsolutePath(outputPath),
      quality: 75
    },
    cwebpOptions: {}
  }
};

describe('Test Webp', function () {
  test('Test Create Webp ', async () => {
    fs.removeSync(webp);

    createWebp.call(context, {path:img});

    expect(fs.existsSync(webp)).toBe(true);
  });

  test('Test Remove Webp ', async () => {
    fs.removeSync(webp);

    createWebp.call(context, {path:img});

    expect(fs.existsSync(webp)).toBe(true);

    removeWebp.call(context, {path:img});

    expect(fs.existsSync(webp)).toBe(false);
  });

  test('Test Keep Webp ', async () => {
    fs.removeSync(webp);

    createWebp.call(context, {path:img});

    expect(fs.existsSync(webp)).toBe(true);

    expect(createWebp.call(context, {path:img})).toBe(undefined);
  });

  test('Test Remove Bigger Webp', async () => {

    emptyDirSync(outputAbPath)

    createWebp.call({
      ...context,
      options: {
        ...context.options,
        pluginOptions: {
          ...context.options.pluginOptions,
          biggerWebpDelete: true
        }
      }
    }, {path:imgBig});

    await new Promise((res)=>setTimeout(()=>{ res(); }, 500));

    expect(fs.existsSync(webpBig)).toBe(false);
  });
});

test('Test Add cwebp params', () => {
  fs.removeSync(webp);

  createWebp.call(contextWithCwebParams, {path:img});

  expect(fs.existsSync(webp)).toBe(true);

  removeWebp.call(contextWithCwebParams, {path:img});

  expect(fs.existsSync(webp)).toBe(false);
});
