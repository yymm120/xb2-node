import express from 'express';

/**
 * 1. create app
 */
const app = express();

/**
 * 2. handle json
 */
app.use(express.json());

/**
 * 3. export app
 */
export default app;