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

