import express from 'express';
import postRouter from '../post/post.router';
import { defaultException } from './app.middleware';

/**
 * 1. create app
 */
const app = express();

/**
 * 2. handle json
 */
app.use(express.json());

/**
 * 4. use router
 */
app.use(postRouter);

/**
 * 5. use exception Handler
 */
app.use(defaultException);

/**
 * 3. export app
 */
export default app;