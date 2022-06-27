
import fs from "fs";
import YAML from "yaml";
import _ from "lodash";
import net from "net";
import localLockUtil = runtimeUtils.localLockUtil;
import {remote} from "webdriverio";

export let log = {
    info: (str) => {
        console.log(str);
    }
}



/**
 * @link
    * runtimeUtils.configurationStrategy
 */
export namespace runtimeUtils {


    /**
     * Configuration strategy
     * @param yamlPath
     * @Author xinhaoluo
     */
    class ConfigurationStrategy {
        public baseConfig = null;
        public extendConfig = null;
        public parentNode = null;

        public cover(baseYamlPath, extendYamlPath) {
            this.baseConfig = this.readYaml(baseYamlPath);
            this.extendConfig = this.readYaml(extendYamlPath);
            // this.nodePath = new Array(...new Map(Object.entries(this.baseConfig)).keys()).join(".");
            let json = JSON.stringify(baseYamlPath)
            this.parentNode = json.slice(2, json.indexOf("\":{"))
            this.coverConfig()
            return this.baseConfig;
        }

        /**
         * Only handle Object, not array
         */
        private coverConfig(pn=this.parentNode, bc=this.baseConfig, ec=this.extendConfig) {
            for (let ic of Object.entries(ec)) {
                let currentNode = pn + ic[0];
                if (ic[1] instanceof Object)
                    this.coverConfig(currentNode, bc, ic[1])
                _.update(bc, `${currentNode}`, () => { return ic[1] })
            }
        }

        public readYaml(yamlPath) {
            let configFile = fs.readFileSync(yamlPath, 'utf-8');
            return YAML.parse(configFile);
        }
    }


    export class Locker {
        private static stat: boolean = false;
        private static timeout: number = 999999;// ms
        private static delay: number = 1000;// ms

        constructor(public LOCAL_LOCK_FILE_PATH,
                    public isDebug,
                    delay: number = Locker.delay,
                    timout: number = Locker.timeout) {
            Locker.delay = delay;
            Locker.timeout = timout;
        };

        private static setStat(stat: boolean): void {
            Locker.stat = stat
        };

        public static getStat(): boolean {
            return Locker.stat
        };


        /**
         * it will be mkdir success only when the path not exists in linux.
         * @return true
         * until mkdir successful
         * @param delay eg. 5000ms
         * @param timeout eg. 180000ms
         */
        public async lock(delay: number = Locker.delay, timeout: number = Locker.timeout): Promise<boolean> {
            if (Locker.getStat()) return Locker.getStat();
            let count = 1, isDebug = this.isDebug, path = this.LOCAL_LOCK_FILE_PATH;
            let tickId = setTimeout(() => {
                timeout = 0
            }, timeout)

            // mkdir
            function mk(resolve, reject, setStat) {
                if (timeout === 0) {   // 1. timout
                    reject('time out!')
                    return;
                }
                try {
                    fs.mkdirSync(path)
                    isDebug ? log.info(`try lock ${count} times success.`) : null;
                    setStat();
                    clearTimeout(tickId);
                    return resolve('mkdir success!')
                } catch (error) {
                    isDebug ? log.info(`retry lock ${++count} times, dir ${path} is already exist.`) : null;
                    return setTimeout(() => {
                        mk(resolve, reject, setStat)
                    }, delay);
                }
            }

            return new Promise(function (resolve, reject) {
                mk(resolve, reject, () => {
                    Locker.setStat(true);
                });
            })

        }


        /**
         * @return true
         * until rmdir successful
         * @param delay {number} default is Locker. delay
         * @param timeout {number} default is Lock. timeout
         */
        public async unlock(delay: number = Locker.delay, timeout: number = Locker.timeout): Promise<boolean> {
            if (!Locker.getStat()) return !Locker.getStat();
            let count = 1, isDebug = this.isDebug, path = this.LOCAL_LOCK_FILE_PATH;
            let tickId = setTimeout(() => {
                timeout = 0
            }, timeout)

            // rmdir
            async function rm(resolve, reject, callback) {
                if (timeout === 0) {   // 1. timout
                    reject('time out!')
                    return;
                }

                try{
                    fs.rmdirSync(path)
                    isDebug ? log.info(`try unlock ${count} times success.`) : null;
                    callback();
                    clearTimeout(tickId);
                    return resolve('rmdir success!')
                }catch (error) {
                    // 3. retry
                    isDebug ? log.info(`retry unlock ${++count} times`) : null;
                    return setTimeout(() => {
                        rm(resolve, reject, callback)
                    }, delay);
                }
            }
            return new Promise((resolve, reject) => {
                rm(resolve, reject, () => {
                    Locker.setStat(false);
                    // return !this.getStat();
                });
            })
        }



        /**
         * @param op function() is necessary arg
         * @param isDebug default is false
         * @param {delayS?, timeoutS?, locker?}, exclusive (locker ∩ (delay, timeout) = Φ)
         * i'   parallelAccessResourceOperation(function(), false, locker=new Locker(...));
         * ii'  parallelAccessResourceOperation(function(), true, 10, 300);
         */
        static async parallelAccessResourceOperation(op, isDebug=false, delayS?, timeoutS?, locker?: Locker): Promise<any> {
            // create a locker
            if (!locker){
                if (delayS && timeoutS){
                    locker = new Locker('./test.lock', isDebug, delayS * 1000, timeoutS * 1000);
                }
            }

            let count = 0, totalTime = timeoutS;
            let tickId = setTimeout(() => timeoutS = 0, timeoutS * 1000);

            // try and retry access resource.
            // 0.check timeout  1.lock before invoke op()  2.retry if op() throw an exception  3.unlock at finally.
            async function accessResource(resolve, reject) {
                if (timeoutS == 0) { // 0. timeout
                    isDebug ? log.info(`stop retry, already retry ${count} times, cost ${totalTime}s`) : null;
                    reject(Error(`access resource Timeout fail! stop retry, already retry ${count} times, cost ${timeoutS}s, step-definitions/common/LoginCommon.ts:257`));
                    return;
                }
                await locker.lock(); // 1. lock
                await op()
                    .then(async (data) => {
                        clearTimeout(tickId);
                        return resolve(data)
                    })
                    .catch((error) => {// 2. retry if capture an exception.
                        isDebug ? log.info(`${error}, and current already retry ${++count} times, cost ${delayS * count}s`) : null;
                        return setTimeout(() => {
                            isDebug ? log.info(`retry again.`) : null;
                            accessResource(resolve, reject);
                        }, delayS * 1000);
                    })
                await locker.unlock()
            }
            await new Promise(((resolve, reject) => {
                accessResource(resolve, reject);
            }))
        }
    }



    // /**
    //  *
    //  */
    // class LocalUtil{
    //     // local process lock
    //     // local process communication
    // }
    //
    // class RemoteUtil{
    //     // Remote process Lock
    //     // Remote process communication
    // }



    // /**
    //  *  Local process communication
    //  */
    // export class LocalProcessC {
    //     private static pipeFile = process.platform === 'win32' ? '\\\\.\\pipe\\mypip' : '/tmp/unix.sock';
    //     private server = net.createServer(connection => {
    //         connection.on('close', () => {
    //         });
    //         connection.on('data', data => {
    //             connection.write(data);
    //         });
    //         connection.on('error', err => {
    //             console.error(err.message)
    //         });
    //     });

    // public send(data) {
    //     try {
    //         fs.unlinkSync(pipeFile);
    //     } catch (error) {
    //     }
    //     server.listen(pipeFile);

    //     }
    // }

    // /**
    //  * Remote Process Communication
    //  */


    //
    export let configurationStrategy = new ConfigurationStrategy();
    // export let remoteUtil = new RemoteUtil();
    // export let localUtil = new LocalUtil();
    export let localLockUtil = {
        accountLocker: new Locker('./test.lock', false, 100, 10000),
        appServerLocker: new Locker('env/appserver/node1/lock', false, 1, 1)
    }
}

