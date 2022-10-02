
// 1. 同时启动三个driver

import {runtimeUtils} from "../../util/Locker";
import localLockUtil = runtimeUtils.localLockUtil;
import {toInteger} from "lodash";
import {ChildProcess, exec, fork} from "child_process";
import {program} from "commander";
import {readFileSync, writeFileSync} from "fs";
const fs = require('fs');



let lock = localLockUtil.accountLocker;
/**
 *
 */
test("testLocker", async () => {
    for (let i = 0; i < 5000; i++) {
        await lock.lock();
        await (() => {
            // 遍历yaml文件,找到一个unused driver
            // 修改yaml文件
            let a = fs.readFileSync('src/test/cucumberParallel/test1.yml', 'utf-8');
            let b = a.match(/\d+/)[0];
            let c = toInteger(b) + 1;
            let d = a.replace(b, c);
            fs.writeFileSync('src/test/cucumberParallel/test1.yml', d)
            console.log(d)
        })()
        await lock.unlock().catch();
        // 启动cucumber
        exec('')
    }
})


test("testLocker1", async () => {
    let a
    function commit() {
        try {
            fs.writeFileSync(a);
        }catch (e){

        }
    }
    function rollback(a) {

    }


    try{
        fs.mkdirSync('./test.lock');
        a = fs.readFileSync('')
        try{
            // do something
            fs.readFileSync('')
            commit()
        }catch (e){
            rollback(a)
        }
    }catch (e){
        throw "error"
    }finally {
        fs.rmdirSync('./test.lock')
    }
})

import {default as Cli} from "cucumber/lib/cli";
test("cucumber", async () => {
    async function runCucumberInternally(): Promise<void> {
        const cwd = process.cwd()
        const cli: Cli = new Cli({
            argv: process.argv,
            cwd,
            stdout: process.stdout,
        });
        console.log("process.argv: ", process.argv);
        try {
            await cli.run()
        } catch (error) {
        }
    }
    await runCucumberInternally();
})

const {remote} = require('webdriverio')
test("demo2", async () => {
    const appDriver = await remote({
        path:'/wd/hub',
        port:4725,
        capabilities: {
            automationName: 'UIAutomator2',
            platformName: 'Android',
            platformVersion: '11',
            deviceName: `127.0.0.1:5556`,
            appPackage: 'com.ferguson.rnapp',
            appActivity: 'com.ferguson.rnapp.MainActivity'
        }
    })
    appDriver.$("id=com.ferguson.rnapp:id/action_bar_root");
})

