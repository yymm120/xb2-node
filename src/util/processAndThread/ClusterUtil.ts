import cluster from 'cluster';
import http from 'http';
import { cpus } from 'os';
import process from 'process';


export class TestCluster{
  numCPUs = cpus().length;

  public test1(){
    if (cluster.isMaster) {
      console.log(`Primary ${process.pid} is running.`);

      for (let i = 0; i< this.numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', ((worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died.`);
      }));
    }else{
      http.createServer((req, res) => {
        res.writeHead(200);
        res.end('hello world\n');
      }).listen(8000);
      console.log(`worker ${process.pid} started.`);
    }
  }
}

export let testCluster = new TestCluster();

