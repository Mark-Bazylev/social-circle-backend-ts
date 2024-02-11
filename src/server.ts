import express, { Application } from "express";
import dotenv from "dotenv";
import { createServer } from "http";

//Security Packages
import helmet from "helmet";
import cors from "cors";
import rateLimiter from "express-rate-limit";
import connectDB from "./db/connect";
//middleware
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT! || 3001;

app.set("trust proxy", 1);
app.use(cors());
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  }),
);
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

//Static File Route
app.use("/assets", express.static("assets"));

//Routes

const server = createServer(app);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);
    server.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
