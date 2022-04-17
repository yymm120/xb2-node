## Arch-Design

### 1. 应用架构规划 (1/18)
1. 模块划分
按照功能，可以划分如下模块
```html
app
auth
user
post
comment
```
2. 细分组件
每个模块都可以添加如下一些组件
```bash
- *.router.ts
- *.controller.ts
- *.middleware.ts
- *.service.ts
```
在router中定义路由，在controller.ts中导入处理器，模块中使用的中间件我们单独放在middleware.ts中，service中定义方法和函数，在controller中就可以重复使用它们。

### 2. 准备项目 (2/18)
清理src


### 3. 复习Javascript模块 (3/18)
1. `import`导入
```typescript
import { greet } from './greeting';
```
2. `export`导出
```typescript
export const greet = (str: string) => {
  console.log(`${str}`)
}
```

### 4. 复习Javascript模块 (4/18)
1. 默认导出
```ts
const greet = (str: string) => {
  console.log(`${str}`)
}
export default greet;
```
2. 随意命名
```ts
import sayHello from './greeting';
```

### 5. 创建应用和Web服务器
0. 创建目录结构
```yaml
- src
  - app
  - user
  - comment
  - auth
  - post
```
1. 创建应用 `src/app/index.ts`
```ts
import express from 'express';
const application = express();
export default application;
```
2. 监听端口8080 `main.ts`
```ts
import app from './app/index'

app.listen(8080, () => {
  console.log("running");
})
```
3. 运行
```bash
npm run start:dev
```
注意：前提是配置了`scripts`命令的。
```json
{
  "scripts": {
    "start:dev": "tsc-watch --onSuccess \"node dist/main.js\""
  }
}
```