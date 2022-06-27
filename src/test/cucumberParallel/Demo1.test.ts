
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


test("test333", () => {
    exec('')
})

