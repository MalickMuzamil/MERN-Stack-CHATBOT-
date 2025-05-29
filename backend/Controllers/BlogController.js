import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AuthController from "./AuthController.js";
import BlogModel from "../Model/BlogModel.js";

class BlogController extends AuthController {
    static GenerateBlog = asyncHandler(async (req, res) => {
        const { prompt, userId, chatId, userResponse } = req.body;

        if (!userId) {
            res.status(400);
            throw new Error("User ID is required");
        }

        if (!chatId && !prompt) {
            res.status(400);
            throw new Error("Prompt is required for the first message");
        }

        let chat;

        if (chatId) {
            chat = await BlogModel.findById(chatId);
            if (!chat) {
                res.status(404);
                throw new Error("Chat not found");
            }
        } else {
            chat = await BlogModel.create({ userId, prompt, messages: [] });
        }

        if (userResponse) {
            chat.messages.push({ sender: "user", content: userResponse });
            await chat.save();
        }

        const conversationHistory = chat.messages.length
            ? chat.messages.map((m) => `${m.sender}: ${m.content}`).join("\n")
            : "No prior messages.";

        const aiPrompt = `
            You are a helpful assistant. You're building a response step by step, using a conversational approach.

            The user's goal is: ${prompt}

            Here is the conversation so far:
            ${conversationHistory}

            Rules:
            - Ask ONLY ONE relevant question at a time.
            - Once you have enough details, reply with "FINAL ANSWER:" followed by your full response.
            - DO NOT ask multiple questions in a single response.
            - Be clear, friendly, and keep the conversation natural.

            Your next reply:`.trim();

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(aiPrompt);
        const generatedContent = result.response ? result.response.text() : "No content generated.";

        chat.messages.push({ sender: "ai", content: generatedContent });
        await chat.save();

        const isFinal = generatedContent.trim().toUpperCase().startsWith("FINAL ANSWER:");

        res.status(200).json({
            status: 200,
            chatId: chat._id,
            isFinal,
            aiMessage: generatedContent,
            conversation: chat.messages,
        });
    });

    static getUserChats = asyncHandler(async (req, res) => {
        const { userId } = req.params;

        if (!userId) {
            res.status(400);
            throw new Error("User ID is required");
        }

        const chats = await BlogModel.find({ userId }).sort({ updatedAt: -1 });

        res.status(200).json(chats);
    });

    static deleteChat = asyncHandler(async (req, res) => {
        const { chatId } = req.params;

        if (!chatId) {
            res.status(400);
            throw new Error("Chat ID is required");
        }

        const chat = await BlogModel.findById(chatId);

        if (!chat) {
            res.status(404);
            throw new Error("Chat not found");
        }

        const deleted = await BlogModel.findByIdAndDelete(chatId);

        if (!deleted) {
            res.status(404);
            throw new Error('Chat not found');
        }

        res.status(200).json(this.generateResponse(200, 'Chat deleted successfully'));
    });
}

export default BlogController;
