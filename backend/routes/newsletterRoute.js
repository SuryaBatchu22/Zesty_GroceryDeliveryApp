import express from "express";
import { subscribe, unsubscribe } from "../controllers/newsLetterController.js";

const newsletterRouter = express.Router();


// Subscribe (POST)
newsletterRouter.post("/subscribe", subscribe);

// Unsubscribe (GET via email link)
newsletterRouter.get("/unsubscribe", unsubscribe);

export default newsletterRouter;
