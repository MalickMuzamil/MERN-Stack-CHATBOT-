import express from "express";
const router = express.Router();

import BlogController from "../Controllers/BlogController.js";

router.post("/", BlogController.GenerateBlog);
router.get("/all/:userId", BlogController.getUserChats);
router.delete('/blogs/:chatId', BlogController.deleteChat);

export default router;
