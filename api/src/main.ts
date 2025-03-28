import express, { Request, Response } from "express";
import { authRouter } from "./routes";

const app = express();

app.use("/api/v1", (_req: Request, res: Response) => {
  res.send(
    "Chat application build using Nodejs, React and postgresql  with Prisma ORM.",
  );
});

app.use("/api/v1/auth", authRouter);

app.listen(5000, () => {
  console.log("app listening on port 5000...");
});
