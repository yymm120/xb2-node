//
// const fs = require("fs")
//
//
// let promise1 = new Promise(resolve => {
//     let request = "321"
//     resolve(request)
// })
// let promise2 = new Promise(resolve => {
//     let response = "123"
//     resolve(response)
// })
//
// Promise.all([promise1, promise2]).then(([data1, data2]) => {
//     console.log(data1);
//     // (data) => {
//     //     console.log(data)
//     // }
// })
//
//
// // Promise.all([fs.readFile("src/test/appium/demo1.ts", () => {}), fs.readFile("src/test/appium/demo2-appium.ts", "utf-8", () => {})]).then(data => {
// // console.log(data)
// // })

// WebdriverIO.

class Class1{
    length: number
}
class Class2{
    size: number
}

class Test<T> {
    name: T extends Class1 ? Class1 : Class2;

    constructor(name: T extends Class1 ? Class1 : Class2) {
        this.name = name;
    }
}

new Test<Class2>(new Class2())
new Test<Class2>(new Class1())
new Test<Class1>(new Class2());















