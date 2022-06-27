
// 1. 同时启动三个driver

import {runtimeUtils} from "../../util/Locker";
import localLockUtil = runtimeUtils.localLockUtil;
import {toInteger} from "lodash";
import {ChildProcess, exec, fork} from "child_process";
import {program} from "commander";
const fs = require('fs');


program
    .command('test1')
    .option('-c --conf')
    .option('')

program.parse(process.argv);

if (program.commands[0].opts().conf){
    console.log('hello')
}

/**
 *
 */
test("testLocker", () => {
    let child = exec("tasklist", (error, stdout, stderr) => {
        console.log(stdout)
        console.log(error)
        console.log(stderr)
    })
    child.stdout.once('data', (stdout) => {
        console.log(stdout)
    })
})


