import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AuthController from "./AuthController.js";
import mongoose from 'mongoose';

import ChatModel from "../Model/ChatModel.js";

class GenerateContent extends AuthController {
    static GenerateContent = asyncHandler(async (req, res) => {
        const { prompt, userId, chatId } = req.body;

        if (!prompt) {
            res.status(400);
            throw new Error("Prompt is required");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const generatedContent = result.response ? result.response.text() : "No content generated";

        let chat;

        if (chatId) {
            chat = await ChatModel.findById(chatId);
            if (!chat) {
                res.status(404);
                throw new Error("Chat not found");
            }

            chat.messages.push(
                { sender: "user", content: prompt },
                { sender: "ai", content: generatedContent }
            );
            await chat.save();
        }

        else {
            chat = await ChatModel.create({
                userId,
                messages: [
                    { sender: "user", content: prompt },
                    { sender: "ai", content: generatedContent }
                ]
            });
        }

        res.status(200).json(this.generateResponse(200, "Generated Content", chat));
    });

    static getGeneratedContent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400);
        throw new Error('User ID is required');
    }

    const chats = await ChatModel.find({ userId: id }).sort({ createdAt: -1 });

    if (!chats || chats.length === 0) {
        res.status(404);
        throw new Error('No chats found for this user');
    }

    return res.status(200).json(
        this.generateResponse(200, 'Chats fetched successfully', chats)
    );
});


    static DeletedGeneratedContent = asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(401);
                throw new Error('Given Id is not a Valid')
            }

            const DeletedChatModel = await ChatModel.deleteMany({ userId: id });

            if (DeletedChatModel.deletedCount === 0) {
                res.status(404);
                throw new Error('No Chats found for this user')
            }

            res.status(200).json(this.generateResponse(200, `${DeletedChatModel.deletedCount} chats deleted successfully`))
        }

        catch (error) {
            res.status(400);
            throw new Error("Error fetching content: " + error.message);
        }
    });
}

export default GenerateContent;
