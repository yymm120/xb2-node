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
