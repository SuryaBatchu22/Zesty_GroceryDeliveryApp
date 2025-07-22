import express from "express";
import { subscribe, unsubscribe } from "../controllers/newsletterController.js";

const newsletterRouter = express.Router();


// Subscribe (POST)
newsletterRouter.post("/subscribe", subscribe);

// Unsubscribe (GET via email link)
newsletterRouter.get("/unsubscribe", unsubscribe);

export default newsletterRouter;
