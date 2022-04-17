import express from 'express';
// 导入所有的东西，然后取个名字叫postController
import * as postController from './post.controller';

const router = express.Router();

/**
 * 内容列表
 */
router.get('/posts', postController.index);

/**
 * 导出路由
 */
export default router;
