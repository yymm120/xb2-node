import { clearTimeout } from 'timers';

export class AccountType {
  index: number;
  constructor(
    index:number,
    public email: string,
    public password: string,
    public type: string) {
    this.index = index;
  }
  public toString(): string{
    return `index = ${this.index}, ` +
      `email = ${this.email}, ` +
      `password = ${this.password}`;
  }
}
/**
 * Read json file
 * @param jFile Json file path
 */
export function readJson(jFile: string) {
  try {
    const fs = require('fs');
    let rawData = fs.readFileSync(jFile);
    return JSON.parse(rawData);
  } catch (e) {
    console.log(e);
  }
}

/**
 * Write to json
 * @param jFile Json file path
 * @param json Json object
 */
export function writeToJson(jFile: string, json: object) {
  try {
    const fs    = require('fs');
    const data  = JSON.stringify(json, null, '\t');
    fs.writeFileSync(jFile, data);
    return true
  } catch (e) {
    console.log(e);
    return false;
  }
}
const fs = require('fs');
const _ = require('lodash');
let globalAccount;
let jsonFile = "E:\\code\\learn\\xb2-node\\TestData.json";
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * @description This is util tools used in login step. Get prepared needed data, then login site with a unity way.
 * @see loginCommon.getUnusedAccountFromJson
 * prepare an account with unused.
 * @see loginCommon.getFirstAccount
 * prepare an account with first.
 *
 * use example:
 * @see loginCommon.customerLogin
 */
export namespace loginCommon {
  export const LOCAL_LOCK_FILE_TEST = 'data/regression/FG/global/TestData.lock';

  /**
   * use example
   * @see loginCommon.Locker.parallelAccessResourceOperation
   * @Description: This is a Locker.
   * @author xinhao
   */
  export class Locker {
    /**
     * stat is true, its means in lock successfully.
     */
    private stat: boolean = false;
    private static timeout: number = 999999;// ms
    private static delay: number = 1000;// ms

    constructor(public LOCAL_LOCK_FILE_PATH,
                public isDebug,
                delay: number = Locker.delay,
                timout: number = Locker.timeout) {
      Locker.delay = delay;
      Locker.timeout = timout;
    };

    public setStat(stat: boolean): void {
      this.stat = stat
    };

    public getStat(): boolean {
      return this.stat
    };


    /**
     * it will be mkdir success only when the path not exists in linux.
     * @return true
     * until mkdir successful
     * @param delay eg. 5000ms
     * @param timeout eg. 180000ms
     */
    public async lock(delay: number = Locker.delay, timeout: number = Locker.timeout): Promise<boolean> {
      if (this.getStat()) return this.getStat();
      let count = 1, isDebug = this.isDebug, path = this.LOCAL_LOCK_FILE_PATH;
      let tickId = setTimeout(() => {
        timeout = 0
      }, timeout)

      // mkdir
      function mk(resolve, reject, callback) {
        if (timeout === 0) {   // 1. timout
          reject('time out!')
          return;
        }
        try {
          fs.mkdirSync(path)
          isDebug ? console.log(`try lock ${count} times success.`) : null;
          callback();
          return resolve('rmdir success!')
        } catch (error) {
          isDebug ? console.log(`retry lock ${++count} times`) : null;
          return setTimeout(() => {
            mk(resolve, reject, callback)
          }, delay);
        }
      }

      return new Promise((resolve, reject) => {
        mk(resolve, reject, () => {
          this.setStat(true);
          clearTimeout(tickId);
          return this.getStat();
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
      if (!this.getStat()) return !this.getStat();
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

        fs.promises.rmdir(path)
          .then(() => {   // 2. success
            isDebug ? console.log(`try unlock ${count} times success.`) : null;
            callback();
            resolve('rmdir success!')
          })
          .catch(() => {  // 3. retry
            isDebug ? console.log(`retry unlock ${++count} times`) : null;
            return setTimeout(() => {
              rm(resolve, reject, callback)
            }, delay);
          });
      }
      return new Promise((resolve, reject) => {
        rm(resolve, reject, () => {
          this.setStat(false);
          clearTimeout(tickId);
          return !this.getStat();
        });
      })
    }




    /**
     * This method is an example.
     * @param op {function} is a callback, it can be any operation required safe access.
     * @param isDebug {boolean} default is false. used to print debug log when it is true.
     * @param delayS {number} eg. 5s
     * @param timeoutS {number} eg. 180s
     */
    static async parallelAccessResourceOperation(op, isDebug, delayS, timeoutS): Promise<any> {
      // create a locker
      let locker = new Locker('./test.lock', isDebug, delayS * 1000, timeoutS * 1000);
      let count = 0, totalTime = timeoutS;
      let tickId = setTimeout(() => timeoutS = 0, timeoutS * 1000);

      // try and retry access resource.
      // 0.check timeout  1.lock before invoke op()  2.retry if op() throw an exception  3.unlock at finally.
      async function accessResource(resolve, reject) {
        if (timeoutS == 0) { // 0. timeout
          isDebug ? console.log(`stop retry, already retry ${count} times, cost ${totalTime}s`) : null;
          reject(Error(`access resource Timeout fail! stop retry, already retry ${count} times, cost ${timeoutS}s, step-definitions/common/LoginCommon.ts:257`));
          return;
        }
        await locker.lock() // 1. lock
          .then(async () => {
            await op()
              .then( (data) => { // then() when op() success.
                clearTimeout(tickId);
                return resolve(data)
              })
              .catch((error) => { // 2. retry if capture an exception.
                isDebug ? console.log(`${error}, and current already retry ${++count} times, cost ${delayS * count}s`) : null;
                return setTimeout(() => {
                  isDebug ? console.log(`retry again.`) : null;
                  accessResource(resolve, reject);
                }, delayS * 1000);
              })
          }).finally(async () => { // 3. unlock
            await locker.unlock()
          })
      }
      return new Promise(async (resolve, reject) => {
        await accessResource(resolve, reject);
      })
    }
  }






  /**
   * get one unused account from account json, it used in customer login step both FG and PW.
   * @param jFile {string} declared in env.ts
   * @param userType {string} T4
   * @return AccountType
   */
  export async function getUnusedAccountFromJson(jFile, userType): Promise<AccountType> {
    await Locker.parallelAccessResourceOperation(() => {
      // read and find an un used account.
      return new Promise((resolve, reject) => {
        let json =readJson(jFile);
        let allAccount: Array<any> = _.get(json, `Account.${userType}`);
        for (let i = 0; i <= allAccount.length - 1; i++) {
          if (allAccount[i].sUsedFlag == false) {
            let account = new AccountType(i, allAccount[i].sUserEmail, allAccount[i].sPassword, userType);
            _.update(json, `Account.${userType}[${i}].sUsedFlag`, function () { return true });
            writeToJson(jFile, json);
            let data = {account, length: allAccount.length, json};
            return resolve(data);
          }
          if (allAccount.length === i + 1) {
            return reject(new Error("all account is already used!"));
          }
        }
      })
    }, true, 1, 1000)
      .then(({account, length, json}) => {
        let count = JSON.stringify(json.Account.T4).split(`"sUsedFlag":true`).length - 1;
        console.log(`============ Before:getOneUnusedAccountFromJson(): all account is ${length}, used account is ${count} ============`);
        console.log(`============ Before:getOneUnusedAccountFromJson(): ${account.toString()} ============ `)
        globalAccount = account; // success.
      })
      .catch((error) => {
        console.log(error);
      })
    return new Promise((resolve, reject) =>{
      if (globalAccount.email != ''){
        resolve(globalAccount)
      }else{
        let info = `getUnusedAccount Fail`;
        return reject(info);
      }
    })
  }



  /**
   * This method will clean current used account. it invoked after finished a scenario.
   * Before this, the account cannot be used by another scenario.
   * @param jFile is a json file saved all account, declared in env file.
   * @param account current used account.
   */
  export async function releaseAccountForCompleteScenarioFG(jFile: string, account: AccountType) {
    console.log(`============ After: releaseAccountForCompleteScenario(): start clean the account state. =============`);
    await Locker.parallelAccessResourceOperation(async () => {
      return new Promise(((resolve, reject) => {
        let json = readJson(jFile);
        let preCleanFlag = _.get(json, `Account.${account.type}[${account.index}].sUsedFlag`);
        _.update(json, `Account.T4[${globalAccount.index}].sUsedFlag`, function () {
          return false
        });
        writeToJson(jFile, json);
        let afterCleanFlag = _.get(json, `Account.${account.type}[${account.index}].sUsedFlag`);

        let data = {preCleanFlag, afterCleanFlag};
        return resolve(data);
      }))
    }, true, 5, 10).then(({preCleanFlag, afterCleanFlag}) => {
      console.log(`============ before clean, the account[${account.index}] used flag is ${preCleanFlag} =============`);
      console.log(`============ after clean, the account[${account.index}] used flag is ${afterCleanFlag} =============`);
    })
  }




  /**
   * @param jsonPath all account in the json file.
   * @param userType T4
   */
  export async function getFirstAccount(jsonPath: string, userType: string): Promise<AccountType> {
    try {
      let json = readJson(jsonPath);
      let account = _.get(json, `Account.${userType}`)[0];
      console.log(`=========== unRequireUnused account, get first account is ${account.toString()}`);
      return account;
    }catch (e){
      console.log(`=========== get first account fail. ===========`);
      console.log(e);
    }
  }



  /**
   * getUnusedAccountFromJson(): if the scenario does not support user login at the same time, it means that must get an unused account.
   * getFirstAccount() :if the scenario support user login at the same time, then get a first account.
   * @param userType T4
   * @param invokeLogin a call back method of login
   * @param requireUnused
   */
  export async function customerLogin(userType: string, invokeLogin, requireUnused: boolean = true) {
    let account;
    if (requireUnused) {
      account = await loginCommon.getUnusedAccountFromJson(jsonFile, userType);
    } else {
      account = await loginCommon.getFirstAccount(jsonFile, userType);
    }
    if (account.email !== ''){
      // await sleep(200000);
      console.log('end')
      // await invokeLogin(account.email, account.password);
    }
  }
}

// loginCommon.customerLogin('T4', () => {});