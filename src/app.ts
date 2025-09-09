import express from "express";
import todoRouter from "./routes/TodoRoute";
import userRouter from "./routes/UserRoute";
import cookieParser from "cookie-parser";
import routerAuth from "./routes/auth.route";
const app = express();
app.use(express.json());

app.use("/auth", routerAuth);
app.use("/todos", todoRouter);
app.use("/users", userRouter);

export default app;
