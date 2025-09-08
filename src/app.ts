import express from "express";
import todoRouter from "./routes/TodoRoute";

const app = express();
app.use(express.json());

app.use("/todos", todoRouter);

export default app;
