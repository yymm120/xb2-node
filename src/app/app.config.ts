import dotenv from 'dotenv';

/**
 * 1. 将env文件写入环境变量
 */
dotenv.config();

/**
 * 2. 从process.env导出变量
 */
export const { APP_PORT, MYSQL_USER } = process.env;