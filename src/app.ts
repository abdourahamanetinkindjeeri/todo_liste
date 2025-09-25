import express from "express";
import todoRouter from "./routes/TodoRoute.js";
import userRouter from "./routes/UserRoute.js";
import cookieParser from "cookie-parser";
import routerAuth from "./routes/auth.route.js";
import authMiddleware from "./middleware/authMiddleware.js";
import cors from "cors";
import path from "path";

const app = express();

app.use(
    cors({
        // origin: "http://localhost:5173",
        origin: "*",
        credentials: true,
    })
);
app.use("/", express.static(path.join(process.cwd())));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", routerAuth);
app.use("/users", userRouter);
app.use(authMiddleware);
app.use("/todos", todoRouter);


export default app;
