#!/usr/bin/env node

// let {program} = require("commander");
import {program} from "commander";
import {exec, fork} from 'child_process'
import * as net from "net";
import {configUtil} from "./cover";

const YAML = require('yaml');
const fs = require('fs')
const os = require('os')

program
    .version('0.0.1', '-v, --version')
    .command("run-appServers")
    .option('-ac, --app-config <appconfig>', '')

program
    .command('run-appDrivers')
    .option('-c --config <name>', '')
    .option('-a --all-config <name>', '')
    // .option('')
// .option('-ac --appium-config <appiumpath>', '')
// .option('-dc --driver-config <driverpath>', '')








//
// console.log(program.opts())
// console.log(program.getOptionValue('join'))
program.parse(process.argv)

export async function isProcessRunning(emulatorName: string, flag: string): Promise<boolean> {
    const cmd: string = (() => {
        switch (process.platform) {
            case 'win32':
                return `tasklist -v | findstr ${emulatorName}`
            // case 'darwin': return `ps aux | grep ${emulatorName}`
            // case 'linux': return `ps aux | grep ${emulatorName}`
            default:
                return "";
        }
    })()

    return new Promise(async (resolve, reject) => {
        await require('child_process').exec(cmd, (err: Error, stdout: string, stderr: string) => {
            let isUsed = stdout.toLowerCase().indexOf("Android Emulator".toLowerCase()) > -1;
            console.log(stdout)
            resolve(isUsed)
        })
    })
}


async function runEmulator(conf: any, deviceName): Promise<any> {
    let args = conf.emulatorConfig.runArgs;
    let port = deviceName.match(/[\d]+$/)[0];
    let command = "emulator " + args.join(" ")
        .replace(/-port [\d]+/, `-port ${port}`).replace(/(?<=@)\S+/, `android-${deviceName}`);
    console.log("emulator starting: ", command)

    let output = "";
    let count = 0;

    async function waitEmulatorRun(resolve, childProcess) {
        if (count >= 20) {
            resolve({pid: 0, message: "emulator start fail."})
        } else {
            childProcess.stdout.once('data', (stdout) => {
                output += stdout;
                console.log(count++ + ": " + output)
                if (output.indexOf("boot completed") > -1) {
                    resolve({pid: childProcess.pid, message: "emulator completed"})
                } else {
                    waitEmulatorRun(resolve, childProcess);
                }
            })
        }
    }

    return new Promise(async (resolve, reject) => {
        let childProcess = exec(command);
        await waitEmulatorRun(resolve, childProcess);
    })
}

async function isAdbConnect(deviceName) {
    let count = 0;
    let isConnectExec = `adb devices | findstr ${deviceName}`;
    let connectExec = `adb connect ${deviceName}`;
    console.log(`abd connecting: ${connectExec}`)

    function connect(resolve) {
        if (count >= 3) {
            resolve({status: false, message: "time out, " + count * 3 + "s"})
            return
        }
        exec(isConnectExec, ((error, stdout, stderr) => {
            if (stdout.indexOf('device') > -1) {
                resolve({status: true, message: "adb connected"});
            } else {
                count++;
                exec(connectExec)
                setTimeout(() => {
                    connect(resolve)
                }, 3000);
            }
        }))
    }

    return new Promise(((resolve, reject) => {
        connect(resolve);
    }))
}

async function isAppiumConnect(conf, {deviceName, appiumPort}) {
    let isConnectExec = `netstat -ano | findstr ${appiumPort}`;
    let connectExec =
        `appium ` + conf.appiumServer.runArgs
            .join(' ')
            .replace(/(?<=--address\s+)\S+/, '0.0.0.0')
            .replace(/(?<=--port\s+)\S+/, appiumPort)
            .replace(/(?<=--uuid\s+)\S+/, deviceName)
            .replace(/(?<=--apk-pkg\s+)\S+/, conf.apps.app1.appPackage)
            .replace(/(?<=--apk-activity\s+)\S+/, conf.apps.app1.appActivity)
    // .replace(/()/, '')
    let count = 0;
    console.log(`appium starting: ${connectExec}`)

    function connect(resolve) {
        if (count++ >= 3) {
            resolve({status: false, message: "appium connect timeout, " + count * 3 + "s"});
        }
        exec(isConnectExec, ((error, stdout, stderr) => {
            console.log(stdout)
            if (stdout.indexOf(`0.0.0.0:${appiumPort}`) > -1) {
                resolve({status: true, message: "appium connect success"});
            } else {
                exec(connectExec);
                setTimeout(() => {
                    connect(resolve)
                }, 3000)
            }
        }))
    }

    return new Promise(((resolve, reject) => {
        connect(resolve)
    }))
}

async function initAppServers(conf, appServers: any[]): Promise<void> {
    let index = 0;
    try {
        await conf.emulatorDevices.filter(async (device) => {
            let flag = false;
            console.log("the emulator port is: ", device.deviceName.match(/[\d]+$/)[0]);
            if (await isProcessRunning(device.deviceName, "Android Emulator")) {
                flag = true; // do nothing
            } else if (os.freemem() / os.totalmem() >= 0.9) {
                flag = false;
                console.log(`os memory has no space. ${device.deviceName} not started.`)// do nothing
            } else {
                await runEmulator(conf, device.deviceName).then(({pid, message}) => {
                    if (pid !== 0) {
                        appServers.push({
                            deviceName: device.deviceName,
                            emulatorPid: pid,
                            appiumPort: conf.appiumPorts[index]
                        });
                        flag = true;
                    }
                    console.log(`emulator pid:${pid}, ${message} `);
                    console.log('----------------')
                }).then(async () => {
                    console.log("flag = " + flag);
                    if (flag === true) {
                        await isAdbConnect(device.deviceName).then(({status, message}) => {
                            console.log(JSON.stringify(appServers[index]) + `: adb connection is ${status ? 'success' : `fail, reason is ${message}`}`)
                            return status;
                        })
                    }
                }).then(async () => {
                    console.log('appium: ------')
                    if (flag == true) {
                        await isAppiumConnect(conf, appServers[index]).then(({status, message}) => {
                            console.log(JSON.stringify(appServers[index]) +`: appium connection is ${status ? 'success' : `fail, reason is ${message}`}`)
                            index++;
                        })
                    }
                }).catch(e => {
                    fail("Failed! " + e)
                })
            }
        });
    } catch (e) {
        console.log("encounter error.")
    }
    return null;
}


async function initAppDrivers(conf, appDrivers: any[]) {
    // let driver: WebdriverIO.Browser = null;
    // appDriver.config
    // appDrivers.push(driver)
}

async function runParallelCucumber(conf: any, appServers: any[], appDriver: any[]) {

}
let { remote } = require('webdriverio');

function buildAppDriverConf(pConf: any) {
    console.log(pConf)
    return pConf
}

export default async function runCli(): Promise<void> {
    if (program.commands[0] && program.commands[0].opts().appConfig && program.commands[0].opts().appConfig.length > 0) {
        console.log('------------', program.commands[0])
        let command = program.commands[0];
        let appConfigPath = command.opts().appConfig;
        let conf = configUtil.readYaml(appConfigPath)
        let appServers = [];
        let appDriver = [];

        await initAppServers(conf, appServers);
        // await initAppDrivers(conf, appDriver);
        // await runParallelCucumber(conf, appServers, appDriver);
    }
    if (program.commands[1] && program.commands[1].opts().config && program.commands[1].opts().config.length > 0) {
        let command = program.commands[1];
        console.log('config path: ', command.opts().config)
        let configPath = command.opts().config;
        let conf = configUtil.readYaml(configPath);
        let driver = conf.driver;
        let config = configUtil.cover(driver, conf.node1[0].clientConfig);
        let client = await remote(config)
    }
    return null;
}

