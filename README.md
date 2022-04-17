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
