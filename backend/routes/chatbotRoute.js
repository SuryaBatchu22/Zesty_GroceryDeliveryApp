import express from 'express';
import { askChatbotSmart} from '../controllers/chatbotController.js';

const chatbotRouter = express.Router();

chatbotRouter.post('/ask', askChatbotSmart);

export default chatbotRouter;