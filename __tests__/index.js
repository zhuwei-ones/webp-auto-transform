import {   copyFileSync,  emptyDirSync,   ensureDirSync, moveSync, pathExistsSync, readdirSync, readSync, removeSync, renameSync } from "fs-extra";

import {resolve} from 'path'
import WebpAutoTransform from "../src";
import { sleep } from "../src/utils";



const entryImagePath = resolve(__dirname,"../example/images")

const testImagePath = resolve(__dirname,"./images")
const testImageWebpPath = resolve(__dirname,"./images-webp-all")

// 测试创建目录
const forTestDir= `${testImagePath}/for_test`
const forTestWebpDir= `${testImageWebpPath}/for_test`


const Imgs = {
    test:'test.png',
    big:'big.png',
    optimize:'optimize.png',

    testWebp:'test.webp',
    bigWebp:'big.webp',
    optimizeWebp:'optimize.webp',
}

const EntryImgs = {
    test:`${entryImagePath}/${Imgs.test}`,
    big:`${entryImagePath}/${Imgs.big}`,
    optimize:`${entryImagePath}/${Imgs.optimize}`
}

const TestImg ={
    test:`${testImagePath}/${Imgs.test}`,
    big:`${testImagePath}/${Imgs.big}`,
    optimize: `${testImagePath}/${Imgs.optimize}`,

    testWebp:`${testImageWebpPath}/${Imgs.testWebp}`,
    bigWebp:`${testImageWebpPath}/${Imgs.bigWebp}`,
    optimizeWebp:`${testImageWebpPath}/${Imgs.optimizeWebp}`
}

const TestDirImg = {
    test:`${forTestDir}/${Imgs.test}`,
    big:`${forTestDir}/${Imgs.big}`,
    optimize:`${forTestDir}/${Imgs.optimize}`,

    testWebp:`${forTestWebpDir}/${Imgs.testWebp}`,
    bigWebp:`${forTestWebpDir}/${Imgs.bigWebp}`,
    optimizeWebp:`${forTestWebpDir}/${Imgs.optimizeWebp}`,
}

ensureDirSync(testImagePath)
const watcher = WebpAutoTransform({
    entryPath:"./__tests__/images",
    outputPath:"./__tests__/images-webp-all"
})

beforeEach(()=>{
    emptyDirSync(testImagePath)
    removeSync(testImageWebpPath)
    removeSync(forTestDir)
})

afterAll(()=>{
    removeSync(testImagePath)
    removeSync(testImageWebpPath)
})


describe("Test Create Webp",()=>{
    test("Test Create Webp File",async  () => {

        copyFileSync(EntryImgs.test,TestImg.test)

        await sleep()

        expect(pathExistsSync(TestImg.testWebp)).toBe(true)

    })
    test("Test Create Webp Directory",async () => {

        ensureDirSync(forTestDir)

        copyFileSync(EntryImgs.test,TestDirImg.test)

        await sleep()

        expect(pathExistsSync(TestDirImg.testWebp)).toBe(true)


    })
})

describe("Test Remove Webp", ()=>{

    test("Test Remove Webp File",async () => {

        copyFileSync(EntryImgs.test,TestImg.test)

        await sleep()

        expect(pathExistsSync(TestImg.testWebp)).toBe(true)

        removeSync(TestImg.test)

        await sleep()

        expect(pathExistsSync(TestImg.testWebp)).toBe(false)

    
    });
    test("Test Remove Webp Directory",async  () => {

        ensureDirSync(forTestDir)

        copyFileSync(EntryImgs.test,TestDirImg.test)

        await sleep()

        expect(pathExistsSync(TestDirImg.testWebp)).toBe(true)

        removeSync(forTestDir)

        await sleep()

        expect(pathExistsSync(forTestWebpDir)).toBe(false)

    });
})

describe("Test Move Webp",()=>{

    test("Test Move Webp File",async () => {

        ensureDirSync(forTestDir)

        copyFileSync(EntryImgs.test,TestImg.test)

        await sleep()

        expect(pathExistsSync(TestImg.testWebp)).toBe(true)

        moveSync(TestImg.test,TestDirImg.test)

        await sleep()

        expect(pathExistsSync(TestDirImg.testWebp)).toBe(true)

        expect(pathExistsSync(TestImg.test)).toBe(false)

    });

    test("Test Move Webp Directory", async() => {

        ensureDirSync(forTestDir)

        copyFileSync(EntryImgs.test,TestImg.test)

        await sleep()

        moveSync(TestImg.test,TestDirImg.test)

        await sleep()

        expect(pathExistsSync(TestDirImg.testWebp)).toBe(true)

        const moveDir = "for_test_move"
        const testMoveDir = `${testImagePath}/${moveDir}`

        moveSync(forTestDir,testMoveDir)

        await sleep()

        expect(pathExistsSync(`${testMoveDir}/${Imgs.test}`)).toBe(true)
        
        expect(pathExistsSync(`${testImageWebpPath}/${moveDir}/${Imgs.testWebp}`)).toBe(true)
    });
})

describe("Test Rename Webp",()=>{

    test("Test Move Rename File", async() => {
        copyFileSync(EntryImgs.test,TestImg.test)

        renameSync(TestImg.test,`${testImagePath}/rename.png`)

        await sleep()

        expect(pathExistsSync(TestImg.testWebp)).toBe(false)

        expect(pathExistsSync(`${testImageWebpPath}/rename.webp`)).toBe(true)
    
    });

    test("Test Move Rename Directory", async() => {
    
        ensureDirSync(forTestDir)

        copyFileSync(EntryImgs.test,TestDirImg.test)

        await sleep()
        
        expect(pathExistsSync(TestDirImg.testWebp)).toBe(true)

        renameSync(forTestDir,`${testImagePath}/rename`)

        await sleep()

        expect(pathExistsSync(TestDirImg.testWebp)).toBe(false)

        expect(pathExistsSync(`${testImageWebpPath}/rename/${Imgs.testWebp}`)).toBe(true)
       
    });
})
    
describe("Test Not Img File",()=>{

    test("Test Add Js File", async() => {

        copyFileSync(`${resolve(__dirname,"../example/index.js")}`,`${testImagePath}/index.js`)

        // 如果转换的文件不是图片会报错导致程序退出，所以里面做了过滤以及错误处理

        // 所以这里要测试过滤以及错误处理是否成功，如果再转换图片仍然成功，那么说明程序没有退出，那么就是成功的

        copyFileSync(EntryImgs.test,TestImg.test)

        await sleep()

        expect(pathExistsSync(TestImg.testWebp)).toBe(true)
      
    });
})