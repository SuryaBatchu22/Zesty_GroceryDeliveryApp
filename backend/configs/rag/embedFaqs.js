/*run the command "node embedFaqs.js" whenever you update the faqs data file*/

// configs/embedFaqs.js
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "langchain/document";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load extended knowledge base
const dataPath = path.join(__dirname, "../../data/extended_knowledge_base.json");
const faqData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// Combine question + answer for better embedding
const docs = faqData.map((item) => {
  const text = `${item.question}\n${item.answer}`;
  return new Document({ pageContent: text, metadata: { question: item.question } });
});

// Step 1: Initialize Gemini embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "embedding-001",
  apiKey: process.env.GEMINI_API_KEY,
});

// Step 2: Save vector store locally
const VECTOR_STORE_PATH = path.join(__dirname, "../../data/vectorStore");

const run = async () => {
  const vectorStore = await HNSWLib.fromDocuments(docs, embeddings);
  await vectorStore.save(VECTOR_STORE_PATH);
  console.log(" FAQ embeddings stored at:", VECTOR_STORE_PATH);
};

run().catch(console.error);
