import express from 'express';
import { Client } from 'clearbit';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import router from './router.js';

export const clearbit = new Client({key: String(process.env.SECRET_KEY)});
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.get('/hello', (req, res) => {
    return res.status(200).send("Hello")
})
app.use(router);

app.listen(port, () => {
    console.log(`Server is up on ${port}!`);
})
