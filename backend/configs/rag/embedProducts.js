// configs/embedProducts.js
import "dotenv/config";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { Document } from "langchain/document";
import Product from "../../models/Product.js";
import connectDB from "../db.js";

// For __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output directory for vector store
const VECTOR_STORE_PATH = path.join(__dirname, "../../data/product-embeddings");

export const embedProducts = async () => {
  try {
    await connectDB();

    // Fetch only needed fields (omit image)
    const products = await Product.find({}, "name description price offerPrice category inStock").lean();

    // Format product data into documents
    const docs = products.map((p) => {
      const content = `
        Product: ${p.name}.
        Description: ${Array.isArray(p.description) ? p.description.join(" ") : p.description}.
        Regular Price: $${p.price}.
        Offer Price: $${p.offerPrice}.
        Category: ${p.category}.
        In Stock: ${p.inStock ? "Yes" : "No"}.
      `;

      return new Document({
        pageContent: content.trim(),
        metadata: { id: p._id.toString(), name: p.name }
      });
    });

    // Initialize Gemini embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: "models/embedding-001",
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Create vector store
    const vectorStore = await HNSWLib.fromDocuments(docs, embeddings);
    await vectorStore.save(VECTOR_STORE_PATH);

    console.log("Product embeddings saved.");
    await mongoose.connection.close();
  } catch (err) {
    console.error(" Error embedding products:", err);
  }
};




