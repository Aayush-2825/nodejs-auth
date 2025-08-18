import dotenv from "dotenv";
import express from "express";
import { connectToDB } from "./database/db.js";
import router from "./routes/auth-routes.js";
import homeRouter from "./routes/home-route.js";
import adminRouter from "./routes/admin-routes.js";
import cors from 'cors'
import uploadRouter from "./routes/image-routes.js";

dotenv.config();



const app = express();

const PORT = process.env.PORT || 3000;

connectToDB()

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
      res.send('Hello from our server!')
})
app.use('/api/auth',router)
app.use('/api/home',homeRouter)
app.use('/api/admin',adminRouter)
app.use('/api/image',uploadRouter)

app.listen(PORT, () => {
  console.log(`App is listening on PORT: http://localhost:${PORT} `);
});
