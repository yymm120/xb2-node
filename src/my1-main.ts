/**
 * Request Response demo
 */

import express from 'express';
import { Request, Response } from 'express';
const app = express();
const port = 3000;
// Json 中间件
app.use(express.json());

app.listen(port, () => {
  console.log('server already running');
});

app.get('/', (request, response) => {
  response.send('你好');
});

const data = [
  {
    id: 1,
    title: '关山月',
    content: '明月出天山，苍茫云海间',
  },
  {
    id: 2,
    title: '望岳',
    content: '会当凌绝顶，一览众山小',
  },
  {
    id: 3,
    title: '忆江南',
    content: '日出江花红胜火，春来江水绿如蓝',
  },
];

app.get('/posts', (request, response) => {
  response.send(data);
});

app.get('/posts/:postId', (request, response) => {
  // 获取内容Id
  const { postId } = request.params;
  console.log(postId);
  console.log('request.params', request.params);

  // 查找具体内容
  const posts = data.filter(item => item.id == parseInt(postId));
  console.log(posts);

  // 作出响应
  response.send(posts[0]);
});

/**
 * 创建内容
 */
app.post('/posts', (request, response) => {
  // 获取请求里的数据
  const { content } = request.body;

  // status code
  response.status(201);

  // request header
  console.log(request.header['sing-along']);

  // response header
  response.set('Sing-Along', 'How I wonder what you are!');

  // 作出响应
  response.send({
    message: `成功创建了内容：${content}`,
  });
});
