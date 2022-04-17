import { Request, Response, NextFunction} from 'express';

/**
 * 输出请求地址
 */
export const requestURL = (request: Request, response: Response, next: NextFunction) => {
  console.log(request.url);
  next();
}