import fs from 'fs';
import { AccountType, readJson, loginCommon, writeToJson } from '../../util/LoginCommon';
let Locker = loginCommon.Locker;


/**
 * test1：测试异步任务是js线程执行的还是其他线程执行的?
 */
test('who invoke?', () =>{
  console.log('This is sync.');
  fs.writeFile('./tests.txt', 'test', () => {
    // 因为死循环阻塞，回调函数中的这条log永远不会被打印，
    // 但是如果成功创建文件,就证明异步任务是其他线程执行的。
    console.log('This is function of callback');
  })
  while(true){}
  // 结果：即使js线程被死循环阻塞了，文件依然创建成功！
  // 异步任务是其他线程执行的，回调函数则由js线程执行。
})


/**
 * tip:
 *  宏任务包括：由宿主环境提供——setTimeout，setInterval，setImmediate，I/O，UI rendering事件，postMessage，MessageChannel
 *  微任务包括：由语言标准提供——Promise.then，process.nextTick，Object.observe(已废弃)，MutationObserver
 * test2: 同步任务和异步任务(宏任务、微任务)的执行顺序。
 */
test('order?', () => {
  console.log('1')  // sync

  setTimeout(function () {
    console.log('2')  // async: 宏
    process.nextTick(function () {
      console.log('3')  // async: 宏
    })
    new Promise(function (resolve) {
      console.log('4')  // async
      resolve()    // async
    }).then(function () {
      console.log('5') // async
    })
  })
  Promise.resolve().then(function () {
    console.log('6')   // async
  })
  new Promise(function (resolve) {
    console.log('7')   // async
    resolve()    // async
  }).then(function () {
    console.log('8'); // async
  })
  setTimeout(function () {
    console.log('9')   // async
    process.nextTick(function () {
      console.log('10')  // async
    })
    new Promise(function (resolve) {
      console.log('11')
      resolve()
    }).then(function () {
      console.log('12')
    })
  })
})


test("sample asyn", () => {
  // sep1:
  console.log('1');

  // asyn1
  new Promise(() => {
    let i = 1;
    console.log(i);
  })
  // asyn2
  setTimeout(() => {
    console.log('3');
    // asyn3
    process.nextTick(() => {
      console.log('4');
    })
  })



})

test("LoginCommon", () => {
  loginCommon.customerLogin('T4', () => {});
})


test('sleep', async () => {
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  await sleep(1000);
  console.log('1');
  await sleep(1000);
  console.log('2')
  await sleep(1000);
  console.log('3')
})


test('Promise', async () => {

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }

  function myGetData(getData, times, delay) {
    return new Promise(function(resolve, reject) {
      function attempt () {
        getData().then(resolve).catch(function(erro) {
          console.log(`还有 ${times} 次尝试`)
          if (0 == times) {
            reject(erro)
          } else {
            times--
            setTimeout(attempt, delay)
          }
        })
      }
      attempt()
    })
  }

  let done = false //
  await myGetData(() => {
    return new Promise((resolve, reject) => {
      console.log('try get mydata');
      if (done) return resolve('get data success');
      else {
        throw "error"
      }
    })
  }, 5, 1000)
})





test('Lock', async () => {
  let jFile = './TestData.json';
  let gAccount;
  let _ = require('lodash');
  await Locker.parallelAccessResourceOperation(() => {
    // read and find an un used account.
    return new Promise((resolve, reject) => {
      let json = readJson(jFile);
      let allAccount: Array<any> = _.get(json, `Account.T4`);
      for (let i = 0; i <= allAccount.length - 1; i++) {
        if (allAccount[i].sUsedFlag == false) {
          let account = new AccountType(i, allAccount[i].sUserEmail, allAccount[i].sPassword, "T4");
          _.update(json, `Account.T4[${i}].sUsedFlag`, function () { return true });
          writeToJson(jFile, json);
          let data = { account, length : allAccount.length, json }
          return resolve(data);
        }
        if (allAccount.length === i + 1) {
          throw "all account is already used!"
        }
      }
    })
  }, true, 5, 20)
    .then(({account, length, json}) => {
      let count = JSON.stringify(json.Account.T4).split(`"sUsedFlag":true`).length - 1;
      console.log(`============ Before:getOneUnusedAccountFromJson(): all account is ${length}, used account is ${count} ============`);
      console.log(`============ Before:getOneUnusedAccountFromJson(): ${account.toString()} ============ `)
      gAccount = account;
    }).catch((error) => {
      console.log(error);
    })
  console.log(gAccount)
  await setTimeout(() => {}, 10000);
  await Locker.parallelAccessResourceOperation(() => {
    let json = readJson(jFile);
    _.update(json, `Account.T4[${gAccount.index}].sUsedFlag`, function () { return false });
    writeToJson(jFile, json);
  }, true, 5, 20);
}, 300000);


test('testLock1', async () => {
  let jFile = './TestData.json';
  let gAccount;
  let _ = require('lodash');
  await Locker.parallelAccessResourceOperation(() => {
    // read and find an un used account.
    return new Promise((resolve, reject) => {
      let json = readJson(jFile);
      let allAccount: Array<any> = _.get(json, `Account.T4`);
      for (let i = 0; i <= allAccount.length - 1; i++) {
        if (allAccount[i].sUsedFlag == false) {
          let account = new AccountType(i, allAccount[i].sUserEmail, allAccount[i].sPassword, "T4");
          _.update(json, `Account.T4[${i}].sUsedFlag`, function () { return true });
          writeToJson(jFile, json);
          let data = { account, length : allAccount.length, json }
          return resolve(data);
        }
        if (allAccount.length === i + 1) {
          throw "all account is already used!"
        }
      }
    })
  }, true, 5, 20)
    .then(({account, length, json}) => {
      let count = JSON.stringify(json.Account.T4).split(`"sUsedFlag":true`).length - 1;
      console.log(`============ Before:getOneUnusedAccountFromJson(): all account is ${length}, used account is ${count} ============`);
      console.log(`============ Before:getOneUnusedAccountFromJson(): ${account.toString()} ============ `)
      gAccount = account;
    }).catch((error) => {
      console.log(error);
    })
  console.log(gAccount);

  //
  await setTimeout(() => {}, 10000);
  await Locker.parallelAccessResourceOperation(() => {
    let json = readJson(jFile);
    _.update(json, `Account.T4[${gAccount.index}].sUsedFlag`, function () { return false });
    writeToJson(jFile, json);
  }, true, 5, 20);
}, 300000);


test('testLock', async () => {
  let jFile = './TestData.json';
  let gAccount;
  let _ = require('lodash');
  await Locker.parallelAccessResourceOperation(() => {
    // read and find an un used account.
    return new Promise((resolve, reject) => {
      let json = readJson(jFile);
      let allAccount: Array<any> = _.get(json, `Account.T4`);
      for (let i = 0; i <= allAccount.length - 1; i++) {
        if (allAccount[i].sUsedFlag == false) {
          let account = new AccountType(i, allAccount[i].sUserEmail, allAccount[i].sPassword, "T4");
          _.update(json, `Account.T4[${i}].sUsedFlag`, function () { return true });
          writeToJson(jFile, json);
          let data = { account, length : allAccount.length, json }
          return resolve(data);
        }
        if (allAccount.length === i + 1) {
          throw "all account is already used!"
        }
      }
    })
  }, true, 5, 20)
    .then(({account, length, json}) => {
      let count = JSON.stringify(json.Account.T4).split(`"sUsedFlag":true`).length - 1;
      console.log(`============ Before:getOneUnusedAccountFromJson(): all account is ${length}, used account is ${count} ============`);
      console.log(`============ Before:getOneUnusedAccountFromJson(): ${account.toString()} ============ `)
      gAccount = account;
    }).catch((error) => {
      console.log(error);
    })
  console.log(gAccount)
  await setTimeout(() => {}, 10000);
  await Locker.parallelAccessResourceOperation(() => {
    let json = readJson(jFile);
    _.update(json, `Account.T4[${gAccount.index}].sUsedFlag`, function () { return false });
    writeToJson(jFile, json);
  }, true, 5, 20);
}, 300000);





test('test-block', async () => {
  // create a locker
  const _ = require('lodash');
  let locker = new Locker('./test.lock', true, 1000, 10 * 1000);

  function op(jFile): any {
    return new Promise((resolve, reject) => {
      let json = readJson(jFile);
      let allAccount: Array<any> = _.get(json, `Account.T4`);
      for (let i = 0; i <= allAccount.length - 1; i++) {
        if (allAccount[i].sUsedFlag == false) {
          let account = new AccountType(i, allAccount[i].sUserEmail, allAccount[i].sPassword, "T4");
          _.update(json, `Account.T4[${i}].sUsedFlag`, function() { return true });
          writeToJson(jFile, json);
          let data = { account, length: allAccount.length, json }
          return resolve(data);
        }
        if (allAccount.length === i + 1) {
          reject(new Error("all account is already used!"));
        }
      }
    })
  }

  await locker
    .lock()
    .then((isLock) => {
      console.log(`${isLock}`);
      if (isLock) {
        return op("");
      }
    })
    .then((data) => {
      console.log(data)
    }).catch((error) => {
      console.log(error);
      setTimeout(() => {

      })
    }).finally(async () => {
      await locker.unlock()
    })

})


