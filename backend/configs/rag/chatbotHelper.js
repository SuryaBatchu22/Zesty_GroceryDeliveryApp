// configs/chatRouter.js
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import path from "path";
import { fileURLToPath } from "url";
import { FaqAnswers } from "./faqHelper.js";
import { ProductAnswers } from "./prodHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to vector stores
const FAQ_STORE_PATH = path.join(__dirname, "../../data/vectorStore");
const PRODUCT_STORE_PATH = path.join(__dirname, "../../data/product-embeddings");

const embeddings = new GoogleGenerativeAIEmbeddings({
  modelName: "embedding-001",
  apiKey: process.env.GEMINI_API_KEY,
});

const isFallbackAnswer = (text = "") => {
  return text.trim() === "I'm not sure about that. Please contact our support team.";
};


// Smart router function
export const chatbotHelper = async (question) => {
  try {
    // Load both stores
    const [faqStore, prodStore] = await Promise.all([
      HNSWLib.load(FAQ_STORE_PATH, embeddings),
      HNSWLib.load(PRODUCT_STORE_PATH, embeddings),
    ]);

    // Get top match score from each
    const [faqDocs, prodDocs] = await Promise.all([
      faqStore.similaritySearchWithScore(question, 1),
      prodStore.similaritySearchWithScore(question, 1),
    ]);

    const faqScore = faqDocs?.[0]?.[1] ?? Infinity;
    const prodScore = prodDocs?.[0]?.[1] ?? Infinity;


    // First preference
    const primary = faqScore < prodScore ? "faq" : "product";
    let answer = "";
    if (primary === "faq") {
      answer = await FaqAnswers(question);
      if (isFallbackAnswer(answer)) {
        answer = await ProductAnswers(question);
      }
    } else {
      answer = await ProductAnswers(question);
      if (isFallbackAnswer(answer)) {
        answer = await FaqAnswers(question);
        
      }
    }

    // if (isFallbackAnswer(answer)) {
    //   return "I'm not sure about that. Please contact our support team.";
    // }

    return answer;
  } catch (err) {
    console.error("chatbot helper error:", err);
    return "Sorry, I couldn't understand your question. Please try again.";
  }
};
