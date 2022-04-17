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
- *.post.controller.ts
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

### 5. 创建应用和Web服务器 (5/18)
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

### 6-8. 创建应用和Web服务器 (6-8/18)
1. 在nodejs中，我们可以通过`process.env`获取环境变量
```bash
# 进入node交互模式
node
> process.env.PWD
> process.env['PWD']
# 输出
'/usr/local/share/tools/xb2-node'
```
2. 设置环境变量
```bash
export NODE_ENV=deployment
# 再次进入node交互模式
> process.env.NODE_ENV
# 输出
deployment
```
3. 通常，我们需要定义多个不同的环境配置文件
.env
.env.test
.env.production
.env.deployment
4. 如下，配置了对应环境的`port`和`mysql_user`
```properties
APP_PORT=8080
MYSQL_USER=root
```
忽略掉这些文件
```ignore
.env*
```

### 9. 创建应用和Web服务器 (9/18)
1. 安装`dotenv@8.2.0` 
```bash
npm install dotenv@8.2.0 --save-dev
```
2. 配置`.env.*`文件
3. 添加`./src/app/app.config.ts`文件，作为app模块的配置文件
```typescript
import dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();
export const { APP_PORT, MYSQL_USER } = process.env;
```
4. 在`main.ts`中使用环境变量的值

```typescript
import { APP_PORT } from './src/app/app.config';
import app from './index';

app.listen(APP_PORT, () => {})
```

### 10. controller控制器 (10/18)
接口的处理器我们称为控制器`controller`
1. 控制器里面的每一个handle方法都用export导出。
edit `./src/post/post.controller.ts` 
```typescript
import { Request, Response, NextFunction } from 'express';
export const index = (request: Request, response: Response, next: NextFunction) => {
  console.log("内容列表接口")
}
```

### 11. router路由 (11/18)
1. 应用的`router`和`controller`一样, 单独放到每个模块下。
以放到`post`模块的`router`为例, **edit** `./src/post/post.router.ts` 
```typescript
import express from 'express';
import * as postController from './post.controller';
const router = express.Router();
/**
 * 定义路由接口
 */
router.get('/posts', postController.index);
// 默认导出router
export default router;
```
> 所谓路由，就是一个映射关系，当url的`api`为`/post`时，就映射到`postController.index方法上。
2. 使用定义好的`router`接口
**edit** `./src/app/index.ts`文件。

```typescript
import express from 'express';
import postRouter from './post.router';
const app = express();
/**
 * 使用路由
 */
app.use(postRouter);
export default app;
```
3. 执行`start:dev`，发送url:http://localhost:8080/posts

### 12. service服务 (12/18)
1. service服务用来环节controller的压力
让公共的函数成为一个服务，供controller调用
**edit** `./src/post/post.service.ts` 
```typescript
export const getPosts = () => {
  // to do and return data
  return data;
}
```
2. 在`controller`中调用该`service`
让controller的代码看起来更简洁
```typescript
import { Request, Response, NextFunction } from 'express';
/**
 * 调用该service
 */
import { getPosts } from './post.service';
export const index = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.send(getPosts());
}
```

### 13-14. middleware (13-14/18)
1. middleware中间件会在一个请求的过程中有序的执行，它在controller方法之前执行。
2. 定义一个中间件，让它打印url `consolo.log(url);` 
**edit** `./src/app/app.middleware.ts`

```typescript
import { Request, Response , NextFunction } from 'express';
export const requestURL = (request, response, next) => {
  console.log(request.url);
  next();
}
```
> 最后一定要调用`next()`方法，否则会阻塞。

**edit** `./src/post/post.router.ts`

```typescript
import express from 'express';
import * as postController from './post.controller';
import { requestURL } from './app.middleware';
const router = express.Router()
/**
 * 使用中间件middleware
 */
router.get("/posts", requestURL, postController.index);
// 导出router
export default router;
```
3. 执行`start:dev`，请求`/posts`接口，此时会看到终端上打印了`/posts`，说明中间件的`console.log(request.url)`工作正常。

