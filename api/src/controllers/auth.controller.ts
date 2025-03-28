import { Request, Response } from "express";

export default class AuthController {
  login(req: Request, res: Response) {
    res.status(200).json({
      status: "login",
    });
  }

  logout(req: Request, res: Response) {
    res.status(200).json({
      status: "login",
    });
  }

  signup(req: Request, res: Response) {
    res.status(200).json({
      status: "login",
    });
  }
}
