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


