import express from 'express';
import postRouter from '../post/post.router';

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
 * 3. export app
 */
export default app;