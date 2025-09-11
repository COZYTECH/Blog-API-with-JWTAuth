import express from "express";
import commentRouter from "./router/commentRouter.js";
import blogPostRouter from "./router/blogPostRouter.js";
import authRouter from "./router/authRouter.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", commentRouter);
app.use("/api/user", blogPostRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected and running!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("welcome to my blog api project");
});

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
