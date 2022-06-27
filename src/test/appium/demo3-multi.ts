

// create multi appium server
// import {multiremote} from "webdriverio";

let { multiremote } = require("webdriverio");
// let { remote } = require('webdriverio');
(async () => {
    const browser = await multiremote({
        appium1: {
            path:'/wd/hub',
            port:4723,
            logLevel:'info',
            capabilities: {
                automationName: 'UIAutomator2',
                platformName: 'Android',
                platformVersion: '11',
                deviceName: `127.0.0.1:5554`,
                skipDeviceInitialization: false,
                skipServerInstallation: false
            }
        },
        appium2: {
            path:'/wd/hub',
            port:4725,
            logLevel:'info',
            capabilities: {
                automationName: 'UIAutomator2',
                platformName: 'Android',
                platformVersion: '11',
                deviceName: `127.0.0.1:5556`,
                skipDeviceInitialization: false,
                skipServerInstallation: false
            }
        }
    })
    await browser[`appium1`].saveScreenshot('./screenshot1.png')
    await browser[`appium2`].saveScreenshot('./screenshot2.png')
    await browser.deleteSession()
})()