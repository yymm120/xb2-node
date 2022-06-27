





// const { remote } = require("webdriverio")
let { remote } = require('webdriverio');

(async () => {
    let appDriver = await remote({
        path:'/wd/hub',
        port:4725,
        capabilities: {
            automationName: 'UIAutomator2',
            platformName: 'Android',
            platformVersion: '11',
            deviceName: `127.0.0.1:5554`,
            appPackage: 'com.ferguson.rnapp',
            appActivity: 'com.ferguson.rnapp.MainActivity'
        }
    })


})()