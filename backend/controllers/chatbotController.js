// controllers/chatbotController.js
import { chatbotHelper } from "../configs/rag/chatbotHelper.js";

export const askChatbotSmart = async (req, res) => {
  try {
    const userQuestion = req.body.message;

    if (!userQuestion || userQuestion.trim().length === 0) {
      return res.status(400).json({ reply: "Please feel free to ask me!" });
    }

    const answer = await chatbotHelper(userQuestion);

    return res.json({
      reply: answer
    });
  } catch (err) {
    console.error("[askChatbotSmart] Error:", err.message);
    return res.status(500).json({ reply: "Oops! Something went wrong." });
  }
};
