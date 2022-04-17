# 小白兔的开发之路

## 生成密钥与公钥

```
cd config
openssl
genrsa -out private.key 4096
rsa -in private.key -pubout -out public.key
exit
```

## Typescript

tsc 命令
tsconfig.json 配置项

### Nodejs-9-6 .d.ts
    tsc命令会生成对应的`.d.ts`文件

### Nodejs-9-7 @types/node
1. nodejs推出模块概念时，js还没有提供自己的模块系统，所以nodejs会使用另一套模块系统`commonJS`。
2. 后来js提供了自己的模块系统，我们使用了typescript，可以使用js提供的标准模块系统，
3. 安装@types/node包，这些以@types为前缀的包都是类型定义的包。

```bash
npm install @types/node --save-dev
```

### Nodejs-9-8 使用js标准模块系统
1. 标准导入模块写法
```ts
import express from 'express';
```
2. tsc会将其转换为nodejs能看懂的写法
```js
__importDefault(require("express"));
```

### Nodejs-9-9 安装类型定义
1. 在编辑器中，无法静态的分析express这个框架的类型，无法自动不全和智能提示。
2. 安装express框架的类型定义。
```bash
npm install @types/express --save-dev
```
另外，idea 的设置中，文件类型设置了忽略node_module文件后，就没有代码提示了。

### Nodejs-9-10 设置处理器参数的类型
1. 设置参数类型不是必须的，typescript会去猜测这个参数的类型，猜不出就认定为any任意类型。
2. 设置参数类型
```ts
import { Request, Response } from 'express';
var request: Request;
```

### Node-js-9-11 typescript检查出来的问题
1. 在比较运算时，javascript会自动转换类型。
```javascript
var boolean = intParam == stringParam;
```
但是typescript会给出警告, 利用parseInt将字符串转换为十进制数字。
```ts
var boolean = intParam == parseInt(stringParam, 10)
```

### Node-js-9-12 智能提示

### Node-js-9-13 自动编译与重启
1. 使用tsc-watch工具
```bash
npm install tsc-watch@4.2.5 --save-dev
```
这是一个命令行工具，它可以监视项目中文件的变化。
在package.json中添加如下命令
```json
{
  "scripts": {
    "start:dev": "tsc-watch --onSuccess \"node dist/main.js\""
  }
}
```
重新编译后，执行`npm start:dev`

### Node-js-9-14 自动排版代码Prettier
1. 安装`Prettier`包和插件。
```bash
npm install prettier@1.19.1 --save-dev --save-exact
```
它提供了一个命令行工具，位于`.bin`目录中，我们可以在`package.json`中配置它。
```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.ts\""
  }
}
```
然后，编辑配置文件`prettierrc`
```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```
还可以安装插件,名字也叫`prettier`，我们可以通过`ctrl+q`得到配置项的含义。


### Node-js-9-15  Typescript基础
E:\code\learn\front-end\learn1-ts0
note: 笔记/前端/typescript

