const fs = require('fs');
import {toInteger} from "lodash";
import {runtimeUtils} from "../../util/Locker";
import localLockUtil = runtimeUtils.localLockUtil;

(async () => {
    for (let i = 0; i < 10; i++) {
        localLockUtil.accountLocker.lock()
            .then(() => {
                let a = fs.readFileSync('src/test/cucumberParallel/test1.yml', 'utf-8');
                let b = a.match(/\d/)[0];
                let c = toInteger(b) + 1;
                let d = a.replace(b, c);
                fs.writeFileSync('src/test/cucumberParallel/test1.yml', d)
                console.log(d)
            }).catch();
        await localLockUtil.accountLocker.unlock();
    }
})()