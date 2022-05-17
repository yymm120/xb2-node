const { spawn, exec, execFile, fork } = require('child_process')
import * as cluster from 'cluster';
const { util } = require('util');
import * as http from 'http';
import { cpus } from 'os';

// 1. spawn(command[, args][, options])
// 2. exec(command[, options][, callback])
// 3. execFile(file[, args][, options][, callback])
// 4. fork(modulePath[, args][, options])
// 5. cluster 集群


class Spawn{
  child = spawn('ls', ['-lh', '/home']);
  public test1():void{
    const {stdin, stdout, stderr} = this.child;
    this.child.on('close', (code) => {
      console.log();
    })
  }
  public test2(): void{

  }
}

new Spawn().test1()


if (cluster.isMaster){
  console.log();
  for (let i = 0; i < numCPUs; i++){
    cluster.fork();
  }
  cluster.on('exit', (work, code, signal) => {
    console.log();
  })
}else {
  //

}