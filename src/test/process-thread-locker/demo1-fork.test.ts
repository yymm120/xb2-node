test("test1", async () =>{
    let { fork } = require('child_process')
    let { cpus } = require('os');

    cpus().map(() => {
        fork('./src/test/process-thread-locker/worker.ts');
    })
    await setTimeout(() => {}, 20000)
})