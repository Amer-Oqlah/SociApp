import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv"
import postRoutes from './routes/posts.js';
import userRouter from "./routes/user.js";


dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}))

app.use(cors());

app.use('/posts', postRoutes);
app.use("/user", userRouter);


const PORT = process.env.PORT|| 5000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);
