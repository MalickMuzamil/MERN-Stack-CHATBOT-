import express from "express";
const router = express.Router();

import GenerateContent from "../Controllers/GenerateContent.js";

router.post("/", GenerateContent.GenerateContent);
router.get("/user/:id", GenerateContent.getGeneratedContent);
router.get("/user/chat/:id", GenerateContent.getChatById);
router.delete('/delete-chat/:id', GenerateContent.DeleteChatById);
router.post("/new", GenerateContent.GenerateNewChatContent);

export default router;
