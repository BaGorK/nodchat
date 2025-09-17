import express from 'express';
import { AuthController } from '../controllers';
import { MessageController } from '../controllers/message.controller';
const router = express.Router();

const messageController = new MessageController();
const authController = new AuthController();

router.use((req, res, next) => authController.protect(req, res, next));

router.get('/conversations', (req, res) => messageController.getUsersToChat(req, res));
router.get('/:id', (req, res) => messageController.getMessages(req, res));
router.post('/send/:id', (req, res) => messageController.sendMessage(req, res));

export default router;
