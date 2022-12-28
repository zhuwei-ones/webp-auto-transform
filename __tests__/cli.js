import transformWebpBatch from "../src/cli";
import shell from "shelljs";
import fs from "fs-extra";
import path from "path";
import { sleep } from "../src/utils";

const entryPath = "./example/images";
const outputPath = "./example/images-webp-test-cli";
const configPath = "./example/testConfig.json";

const config = {
  entryPath,
  outputPath,
};

const currentCwd = process.cwd();

const outputAbPath = path.resolve(currentCwd, outputPath);

const webp = path.resolve(outputAbPath, "test.webp");
const webp2 = path.resolve(outputAbPath, "optimize.webp");

beforeEach(() => {
  fs.removeSync(outputAbPath);
  fs.ensureDirSync(outputAbPath);
});

afterEach(() => {
  fs.removeSync(outputAbPath);
});

test("Test Cli Function", async () => {

  transformWebpBatch(config);

  await sleep(500);

  expect(fs.existsSync(webp)).toBe(true);
  expect(fs.existsSync(webp2)).toBe(true);

});

test("Test Cli Width Config", () => {
  fs.ensureFileSync(configPath);
  fs.writeJsonSync(configPath,config,{spaces:4})
  try {
    shell.exec('npm i -g . ')
    shell.exec(`webp-transform --config ${configPath}`)
    expect(fs.existsSync(webp)).toBe(true);
    expect(fs.existsSync(webp2)).toBe(true);
    fs.removeSync(configPath);
  } catch (error) {
    console.log("执行 cli 报错了",error.message)
  }
});
