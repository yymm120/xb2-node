import { Request, Response, NextFunction } from 'express';
import { getPosts } from './post.service';

/**
 * 内容列表
 */
export const index = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  /**
   * 使用异常处理器（同样是一个middleware，只不过它在app.use()中被调用）
   * 在这里我们检查header，然后交给异常处理处理。
   */
  if (request.headers.authorization !== "SECRET"){
    return next(new Error());
  }
  /**
   * 使用middleware
   */
  const posts = getPosts();
  response.send(posts);
}