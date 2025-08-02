import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import classifyRoute from './routes/classify.js';

dotenv.config();
const port = process.env.PORT || 4000;


const app = express();


 //Cross-Origin Resource Sharing
 app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
  

 app.use(express.json());
 app.use(express.urlencoded({extended: true})); 


app.use('/api/classify', classifyRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));

