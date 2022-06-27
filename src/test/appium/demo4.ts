




// create multi appium server
// let { remote } = require('webdriverio');
(async () => {

    const browser1 = await remote({
        path:'/wd/hub',
        port:4725,
        capabilities: {
            automationName: 'UIAutomator2',
            platformName: 'Android',
            platformVersion: '11',
            deviceName: `localhost:5556`,
        }
    })
    await browser1.saveScreenshot('./screenshot2.png')
    await browser1.deleteSession()

})()