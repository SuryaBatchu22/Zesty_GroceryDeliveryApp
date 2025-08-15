// configs/ragProductHelper.js
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VECTOR_STORE_PATH = path.join(__dirname, "../../data/product-embeddings");

// 1. Load embeddings + product vector store
const embeddings = new GoogleGenerativeAIEmbeddings({
  modelName: "embedding-001",
  apiKey: process.env.GEMINI_API_KEY,
});

let productVectorStore;
try {
  productVectorStore = await HNSWLib.load(VECTOR_STORE_PATH, embeddings);
} catch (err) {
  console.error(" Failed to load product vector store:", err);
  process.exit(1);
}

// 2. Gemini model
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.3,
});

// 3. Prompt template for product Q&A
const prompt = PromptTemplate.fromTemplate(`
You are an intelligent assistant helping customers with grocery product questions on the Zesty a grocery selling app.

Use ONLY the context provided to answer questions about product names, categories, descriptions, prices, offers, and availability.

Do not invent product names or descriptions.

Answer naturally, helpfully, and based on the context only.
 For example:

- If the user asks for "fruits under 5 dollars", suggest matching items based on price and category.
- If the user wants "fresh vegetables" or "best snacks", suggest products based on description and category.
- Always mention product names and offer prices if available.

Mention the name of the product or its category if it helps answer the question clearly.

If the question cannot be answered using the provided product information, respond exactly with:
"I'm not sure about that. Please contact our support team."

Context:
{context}

Question:
{question}
`);

// 4. RAG Chain
const chain = RunnableSequence.from([
  {
    context: async (input) => {
      const docs = await productVectorStore.similaritySearch(input.question, 4);
      return docs.map(doc => doc.pageContent).join("\n\n");
    },
    question: (input) => input.question,
  },
  prompt,
  model,
]);

// 5. Export handler
export const ProductAnswers = async (userQuestion) => {
  try {
    const response = await chain.invoke({ question: userQuestion });
    return response.content;
  } catch (err) {
    console.error("Error in product RAG:", err);
    return "Sorry, something went wrong while fetching product details.";
  }
};
