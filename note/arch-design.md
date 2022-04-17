## 应用架构规划

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

