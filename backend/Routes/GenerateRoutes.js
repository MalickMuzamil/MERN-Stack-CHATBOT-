import express from "express";
const router = express.Router();

import GenerateContent from "../Controllers/GenerateContent.js";

router.post("/", GenerateContent.GenerateContent);
router.get("/user/:id", GenerateContent.getGeneratedContent);

export default router;
