// configs/ragHelper.js
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
//import { loadVectorStore } from "langchain/vectorstores/hnswlib";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load embeddings + vector store
const embeddings = new GoogleGenerativeAIEmbeddings({
  modelName: "embedding-001",
  apiKey: process.env.GEMINI_API_KEY,
});

const vectorStorePath = path.join(__dirname, "../../data/vectorStore");

let vectorStore;
try {
  vectorStore = await HNSWLib.load(vectorStorePath, embeddings);
} catch (err) {
  console.error(" Failed to load vector store:", err);
  process.exit(1);
}

// 2. Gemini Chat model
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.3,
});

// 3. Prompt template for RAG
const prompt = PromptTemplate.fromTemplate(`
You are a helpful and knowledgeable assistant for a grocery delivery app called Zesty.

Use the context below to answer user questions about how the app works, delivery, returns, payments, and other policies.

Be brief, friendly, and clear. Only answer if the context directly provides the answer.

DO NOT guess or make up answers. If the context doesn't answer the question, respond with:

"I'm not sure about that. Please contact our support team."

Context:
{context}

Question:
{question}
`);

// 4. QA Chain
const chain = RunnableSequence.from([
  {
    context: async (input) => {
      const docs = await vectorStore.similaritySearch(input.question, 4);
      return docs.map(doc => doc.pageContent).join("\n\n");
    },
    question: (input) => input.question,
  },
  prompt,
  model,
]);

// 5. Export function
export const FaqAnswers = async (userQuestion) => {
  try {
    const response = await chain.invoke({ question: userQuestion });
    return response.content;
  } catch (err) {
    console.error(" Error in faq RAG:", err);
    return "Sorry, something went wrong while answering your question.";
  }
};
