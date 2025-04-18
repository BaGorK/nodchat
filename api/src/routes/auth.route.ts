import express from 'express';
import { AuthController } from '../controllers';

const authController = new AuthController();

const router = express.Router();

router.post('/login', (req, res) => authController.login(req, res));
router.post('/signup', (req, res) => authController.signup(req, res));

// protected routes
router.get(
  '/current-user',
  (req, res, next) => authController.protect(req, res, next),
  (req, res) => authController.getCurrentUser(req, res),
);
router.post(
  '/logout',
  (req, res, next) => authController.protect(req, res, next),
  (req, res) => authController.logout(req, res),
);

export default router;
