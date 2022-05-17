import fs from 'fs';
import { TestCluster, testCluster } from '../../util/processAndThread/ClusterUtil';
import { spawn } from 'child_process';


// let locker = new TestLock2('', false);
// while(locker.lock()){
//
//   while(locker.unlock()){
//
//   }
// }
// test('test-process', () => {
//   var testCluster1 = new TestCluster();
//   testCluster1.test1();
// })


test('test-childProcess', () => {
  for (let i = 0; i < 8; i++) {
    const runTest = spawn('ls');
    runTest.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    runTest.on('close', (data) => {
      console.log(`stdout: ${data}`);
    })
    while (true){};
  }
});




