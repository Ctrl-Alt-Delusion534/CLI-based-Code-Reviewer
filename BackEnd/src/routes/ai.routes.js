import express from "express";
const router=express.Router();
import { getReview } from "../controllers/ai.controller.js";

router.post("/get-review",getReview);

export default router;