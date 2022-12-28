import fs, { readFileSync } from "fs-extra";
import path from "path";
import { getAbsolutePath, sleep } from "../src/utils";
import createWebp from "../src/lib/webp/createWebp";

const entryPath = "./example/images";
const outputPath = "./example/images-webp-cache";

const currentCwd = process.cwd();

const entryAbPath = path.resolve(currentCwd, entryPath);
const outputAbPath = path.resolve(currentCwd, outputPath);

const imgBig = path.resolve(entryAbPath, "big.png");

const cachePath = path.resolve(currentCwd, ".webp-transform.cache");

const context = {
  options: {
    // 这里是方法单元测试，不能传入相对路径，因为没有经过里面的方法处理，处理之后是绝对路径
    pluginOptions: {
      entryPath: getAbsolutePath(entryPath),
      outputPath: getAbsolutePath(outputPath),
      cache: true,
      biggerWebpDelete: true,
    },
    cwebpOptions: {},
  },
};

beforeEach(() => {
  fs.removeSync(outputAbPath);
  fs.removeSync(cachePath);
});

afterEach(() => {
  fs.removeSync(outputAbPath);
  fs.removeSync(cachePath);
});

test("Test cache file exist ", async () => {
  createWebp.call(context, { path: imgBig });

  await sleep(1000);

  expect(fs.existsSync(cachePath)).toBe(true);
});

test("Test cache bigger webp correct ", async () => {
  createWebp.call(context, { path: imgBig });

  await sleep(1000);

  try {
    const content = readFileSync(cachePath);

    const currentContent = content.toString();

    if (currentContent) {
      const cacheData = JSON.parse(currentContent);
      return cacheData;
    }

    expect(cacheData[0]).toBe(imgBig);
  } catch (error) {
    console.log("cache bigger webp correct error", error.message);
  }
});
