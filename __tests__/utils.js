const {
  getCurrentOptions,
  isDir,
  verifyOptions,
  setDefaultPluginOptions,
  getWebpTransformPath,
  getCwebpOptions,
  getAbsolutePath,
} = require("../src/utils");

const path = require("path");

const entryPath = "./example/images";
const outputPath = "./example/images-webp-test";
const childPath = "./a";
const demoPng = `${entryPath}/xxxx.png"`;
const demoWebp = `${outputPath}/xxxx.webp`;

const CWD = process.cwd();

const entryAbPath = path.resolve(CWD, entryPath);
const outputAbPath = path.resolve(CWD, outputPath);
const childAbPath = path.resolve(CWD, childPath);
const webpPath = path.resolve(CWD, demoWebp);
const demoPngPath = path.resolve(CWD, demoPng);

const defaultEntry = {
  entryPath: entryPath,
};

const defaultOptions = {
  ...defaultEntry,
  outputPath: outputPath,
  biggerWebpDelete: true,
  customList: [],
  quality: 75,
  webpExistReplace: false,
  quiet: true,
  detailLog:false
};

const resultOptions = {
  ...defaultOptions,
  entryPath: entryAbPath,
  outputPath:getAbsolutePath("./example/images-webp")
};

const errorList = {
  entryPath: (val)=>{
    return new Error(`entryPath 不是一个有效的路径，收到--->${val}`)
  },
  outputErr: (val)=>{
    return new Error(`outputPath 不是一个有效的路径，收到--->${val}`)
  },
  customList: new Error("customList 必须是一个数组"),
  customItem: new Error("customList 子项不是有效值"),
  quality: new Error("quality 必须是0-100"),
  biggerWebpDelete: new Error("biggerWebpDelete 只能是布尔值"),
  webpExistReplace: new Error("webpExistReplace 只能是布尔值"),
};

test("Test isDir", () => {
  expect(isDir()).toBe(false);
  expect(isDir("./aaaa")).toBe(false);
  expect(isDir("./src")).toBe(true);
});

test("Test WebpPath", () => {
  expect(
    getWebpTransformPath(demoPng, {
      entryPath: entryPath,
      outputPath: outputPath,
    })
  ).toBe(webpPath);
  expect(
    getWebpTransformPath(demoPngPath, {
      entryPath: getAbsolutePath(entryPath),
      outputPath: getAbsolutePath(outputPath),
    })
  ).toBe(webpPath);
});

test("Test Error Options", () => {
  expect(() => {
    verifyOptions();
  }).toThrow(errorList.entryPath());

  expect(() => {
    verifyOptions({
      entryPath: true,
    });
  }).toThrow(errorList.entryPath(true));

  expect(() => {
    verifyOptions({
      ...defaultEntry,
      outputPath: true,
    });
  }).toThrow(errorList.outputErr(true));

  expect(() => {
    verifyOptions({
      ...defaultEntry,
      customList: true,
    });
  }).toThrow(errorList.customList);

  expect(() => {
    verifyOptions({
      ...defaultEntry,
      entryPath: entryAbPath,
      customList: [true],
    });
  }).toThrow(errorList.customItem);

  expect(() => {
    verifyOptions({
      entryPath: entryAbPath,
      quality: true,
    });
  }).toThrow(errorList.quality);

  expect(() => {
    verifyOptions({
      ...defaultEntry,
      entryPath: entryAbPath,
      quality: 101,
    });
  }).toThrow(errorList.quality);

  expect(() => {
    verifyOptions({
      ...defaultEntry,
      entryPath: entryAbPath,
      quality: -1,
    });
  }).toThrow(errorList.quality);

  expect(() => {
    verifyOptions({
      ...defaultEntry,
      entryPath: entryAbPath,
      biggerWebpDelete: 1,
    });
  }).toThrow(errorList.biggerWebpDelete);

  expect(() => {
    verifyOptions({
      ...defaultEntry,
      entryPath: entryAbPath,
      webpExistReplace: 2,
    });
  }).toThrow(errorList.webpExistReplace);
});

test("Test Correct Options ", () => {
  expect(
    verifyOptions({
      ...defaultEntry,
      outputPath: "./dist",
      customList: [
        {
          path: "./src/a",
          quality: 90,
        },
      ],
      quality: 10,
      biggerWebpDelete: true,
      webpExistReplace: false,
    })
  ).toBe(undefined);
});

test("Test Default Options", () => {
  expect(setDefaultPluginOptions(defaultEntry)).toStrictEqual({
    ...resultOptions
  });
  expect(
    setDefaultPluginOptions({
      ...defaultEntry,
      customList: [
        {
          path: childPath,
        },
      ],
    })
  ).toStrictEqual(resultOptions);

  expect(
    setDefaultPluginOptions({
      ...defaultEntry,
      customList: [
        {
          path: childPath,
          quality: 80,
        },
      ],
    })
  ).toStrictEqual({
    ...resultOptions,
    customList: [
      {
        path: childAbPath,
        quality: 80,
      },
    ],
  });

  expect(
    setDefaultPluginOptions({
      ...defaultEntry,
      biggerWebpDelete: false,
      webpExistReplace: true,
    })
  ).toStrictEqual({
    ...resultOptions,
    biggerWebpDelete: false,
    webpExistReplace: true,
  });
});

test("Test Options Format", () => {
  expect(() => {
    getCurrentOptions();
  }).toThrow(errorList.entryPath());

  const options = {
    ...defaultOptions,
    entryPath: path.resolve(CWD, entryPath),
    outputPath: path.resolve(CWD, outputPath),
  };

  expect(
    getCurrentOptions({ ...options, near_lossless: 79, z: 9 })
  ).toStrictEqual({
    pluginOptions: delete options.quiet && options,
    cwebpOptions: {
      quality: 75,
      quiet: true,
      near_lossless: 79,
      z: 9,
    },
  });

  expect(
    getCwebpOptions({
      quality: 75,
      quiet: true,
      near_lossless: 79,
      z: 9,
      o: "./index.js",
      bbbb: false,
    })
  ).toStrictEqual(["-q", 75, "-quiet", "-near_lossless", 79, "-z", 9]);
});
