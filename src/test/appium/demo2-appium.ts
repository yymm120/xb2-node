






let { remote } = require('webdriverio');
(async () => {

    const appDriver = await remote({
        path:'/wd/hub',
        port:4723,
        capabilities: {
            automationName: 'UIAutomator2',
            platformName: 'Android',
            platformVersion: '11',
            deviceName: `127.0.0.1:5554`,
            appPackage: 'com.ferguson.rnapp',
            appActivity: 'com.ferguson.rnapp.MainActivity'
        }
    })



    // appDriver.$("").$().$().
    let a = await appDriver.getContext();
    console.log("--1", a);
    await appDriver.activateApp('com.ferguson.rnapp');
    // await appDriver.launchApp();
    await new Promise(resolve => setTimeout(() => {resolve()}, 5000))

    // define selector
    let loginButtonSelector = 'new UiSelector().className("android.widget.Button").instance(0)';
    let emailSelector = 'new UiSelector().className("android.widget.EditText").instance(0)';
    let passwordSelector = 'new UiSelector().className("android.widget.EditText").instance(1)';
    let loginAfterLocationTip = 'new UiSelector().text("While using the app")';


    let loginButton = await appDriver.$(``)
    let emailElement = await appDriver.$(`android=${emailSelector}`);
    let passwordElement = await appDriver.$(`android=${passwordSelector}`);

    await emailElement.clearValue();
    await passwordElement.clearValue();

    await emailElement.addValue("momo@fg.com");
    await passwordElement.setValue("qwe123");
    await new Promise(resolve => setTimeout(() => {resolve()}, 1000))
    await loginButton.click()

    // wait login
    await new Promise(resolve => setTimeout(() => {resolve()}, 3000))

    try {
        let loginSuccessElement = await appDriver.$(`android=${loginAfterLocationTip}`);
        await loginSuccessElement.click();
        console.log("login success");
    }catch (e){
        console.log("login error!");
    }

})()


