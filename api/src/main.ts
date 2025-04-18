import "./config/validate-env";
import express, { Request, Response } from "express";
import { authRouter, messageRouter } from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cookieParser()); // for parsing cookies
app.use(cors()); // for enabling cors

app.get("/api", (_req: Request, res: Response) => {
  res.send(
    "Chat application build using Nodejs, React and postgresql  with Prisma ORM.",
  );
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", messageRouter);

app.listen(5000, () => {
  console.log("app listening on port 5000...");
});
