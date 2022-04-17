import express from 'express';
// 导入所有的东西，然后取个名字叫postController
import * as postController from './post.controller';
// 导入middleware
import { requestURL } from '../app/app.middleware';

const router = express.Router();

/**
 * 内容列表
 * - 使用middleware
 */
router.get('/posts', requestURL, postController.index);

/**
 * 导出路由
 */
export default router;
