import { Request, Response } from 'express';
import { prisma } from '../db/prisma-service';

export class MessageController {
  public async sendMessage(req: Request, res: Response) {
    try {
      const { id: recieverId } = req.params;
      const { id: senderId } = req.user;
      const { message } = req.body;

      let conversation = await prisma.conversation.findFirst({
        where: {
          participantIds: {
            hasEvery: [senderId, recieverId],
          },
        },
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            participantIds: {
              set: [senderId, recieverId],
            },
          },
        });
      }

      const newMessage = await prisma.message.create({
        data: {
          body: message,
          senderId,
          conversationId: conversation.id,
        },
      });

      if (newMessage) {
        conversation = await prisma.conversation.update({
          where: { id: conversation.id },
          data: {
            messages: {
              connect: {
                id: newMessage.id,
              },
            },
          },
        });
      }

      // TODO: implement socket.io

      res.status(201).json(newMessage);
    } catch (err) {
      console.log('[MessageController:sendMessage]: ', err);
      res.status(500).json({
        status: 'error',
        message: 'Error while sending message',
        error: (err as Error).message,
      });
    }
  }

  public async getMessages(req: Request, res: Response) {
    try {
      const { id: recieverId } = req.params;
      const { id: senderId } = req.user;

      const conversation = await prisma.conversation.findFirst({
        where: {
          participantIds: {
            hasEvery: [senderId, recieverId],
          },
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      if (!conversation) {
        res.status(404).json({
          status: 'success',
          message: 'No messages found',
          data: [],
        });
        return;
      }

      res.status(200).json(conversation.messages);
    } catch (err) {
      console.log('[MessageController:getMessages]: ', err);
      res.status(500).json({
        status: 'error',
        message: 'Error while getting messages',
        error: (err as Error).message,
      });
    }
  }

  public async getUsersToChat(req: Request, res: Response) {
    try {
      const { id: userId } = req.user;

      const users = await prisma.user.findMany({
        where: {
          id: {
            not: userId,
          },
        },
        select: {
          id: true,
          fullName: true,
          profilePic: true,
        },
      });

      res.status(200).json(users);
    } catch (err) {
      console.log('[MessageController:getConversations]: ', err);
      res.status(500).json({
        status: 'error',
        message: 'Error while getting conversations',
        error: (err as Error).message,
      });
    }
  }
}
