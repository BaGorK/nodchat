import "dotenv/config";
import express, { Request, Response } from "express";
import { authRouter, messageRouter } from "./routes";

const app = express();

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
