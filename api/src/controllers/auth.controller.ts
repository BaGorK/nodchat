import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { prisma } from '../db/prisma-service';
import { isCorrectPassword } from '../lib/utils/password.util';
import { generateTokenAndSetCookie, verifyJWT } from '../lib/utils/twt-token.util';
import { loginSchema } from '../zod-schemas/login.schema';
import { signupSchema } from '../zod-schemas/signup.schema';
import { User } from '@prisma/client';

// add current user to the express request namespace
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export default class AuthController {
  public async protect(req: Request, res: Response, next: NextFunction) {
    let accessToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      accessToken = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.accessToken) {
      accessToken = req.cookies.accessToken;
    }

    if (!accessToken) {
      res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.',
      });
      return;
    }

    // 2) Verification token
    const decoded = verifyJWT(accessToken);
    const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!currentUser) {
      res.status(401).json({
        status: 'fail',
        message: 'The User belonging to the token doe no longer exist',
      });

      return;
    }

    req.user = currentUser;
    // GRANT ACCESS TO PROTECTED ROUTE
    console.log('GRANT ACCESS TO PROTECTED ROUTE...');
    next();
  }

  public async login(req: Request, res: Response) {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      const validationErrors = result.error.errors.map((err) => err.message);
      res.status(400).json({
        status: 'fail',
        message: 'validation faild.',
        error: validationErrors,
      });
      return;
    }

    const { password, username } = result.data;
    try {
      // check if user exists
      const user = await prisma.user.findUnique({ where: { username } });
      // check if password is correct
      if (
        !user ||
        !(await isCorrectPassword({
          pass: password,
          hashedPass: user.password,
        }))
      ) {
        res.status(400).json({
          status: 'fail',
          message: 'Invalid Credentials',
        });
        return;
      }

      // generate twt-token
      generateTokenAndSetCookie(user, res);

      // return response
      res.status(200).json({
        status: 'login',
        message: 'Login successfully',
        data: user,
      });
    } catch (err) {
      console.log('login: ', err);
      res.status(500).json({
        status: 'error',
        message: (err as Error).message,
      });
    }
  }

  logout(req: Request, res: Response) {
    res.clearCookie('accessToken');
    res.status(200).json({
      status: 'success',
      message: 'Logout successfully',
      data: null,
    });
  }

  public async signup(req: Request, res: Response) {
    try {
      const result = signupSchema.safeParse(req.body);

      if (!result.success) {
        const validationErrors = result.error.errors.map((error) => error.message);
        res.status(400).json({
          status: 'fail',
          message: 'validation faild.',
          error: validationErrors,
        });
        return;
      }

      const { username, fullName, password, gender } = result.data;
      let user = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (user) {
        res.status(400).json({
          status: 'fail',
          message: 'Username already taken',
        });
        return;
      }

      // https://avatar-placeholder.iran.liara.run/
      const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
      const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

      user = await prisma.user.create({
        data: {
          fullName,
          gender,
          username,
          password: await bcrypt.hash(password, 10),
          profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
        },
      });

      generateTokenAndSetCookie(user, res);

      res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: user,
      });
    } catch (err) {
      console.log('signup: ', err);
      res.status(500).json({
        status: 'error',
        message: (err as Error).message,
      });
    }
  }
}
