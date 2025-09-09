import express from "express";
import todoRouter from "./routes/TodoRoute";
import userRouter from "./routes/UserRoute";
import cookieParser from "cookie-parser";
import routerAuth from "./routes/auth.route";
import authMiddleware from "./middleware/authMiddleware";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/auth", routerAuth);

app.use("/users", userRouter);
app.use(authMiddleware);
app.use("/todos", todoRouter);

export default app;
