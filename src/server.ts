import express, { Application } from "express";
import dotenv from "dotenv";
import { createServer } from "http";

//Security Packages
import helmet from "helmet";
import cors from "cors";
import rateLimiter from "express-rate-limit";
import connectDB from "./db/connect";

//middleware
import authenticateUser from "./middleware/authentication";

//Routers
import authRouter from "./routes/auth";
import postsRouter from "./routes/posts";
import accountsRouter from "./routes/accounts";
import friendsDataRouter from "./routes/friendsData";
import commentsRouter from "./routes/comments";

//Error Handler
import notFoundMiddleware from "./middleware/not-found";
import errorHandlerMiddleware from "./middleware/error-handler";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT! || 3000;

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
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", authenticateUser, postsRouter);
app.use("/api/v1/accounts", authenticateUser, accountsRouter);
app.use("/api/v1/friendsRequest", authenticateUser, friendsDataRouter);
app.use("/api/v1/comments", authenticateUser, commentsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

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
