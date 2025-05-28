import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AuthController from "./AuthController.js";
import mongoose from 'mongoose';

import ChatModel from "../Model/ChatModel.js";

class GenerateContent extends AuthController {
    static GenerateContent = asyncHandler(async (req, res) => {
        const { prompt, userId, chatId } = req.body;

        if (!prompt || !userId) {
            res.status(400);
            throw new Error("Prompt and User ID are required");
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
        }

        else {
            const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);
            chat = await ChatModel.findOne({
                userId,
                updatedAt: { $gte: oneHourAgo }
            }).sort({ updatedAt: -1 });
        }

        if (chat) {
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

    static GenerateNewChatContent = asyncHandler(async (req, res) => {
        const { prompt, userId } = req.body;

        if (!prompt || !userId) {
            res.status(400);
            throw new Error("Prompt and User ID are required");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const generatedContent = result.response ? result.response.text() : "No content generated";

        const chat = await ChatModel.create({
            userId,
            messages: [
                { sender: "user", content: prompt },
                { sender: "ai", content: generatedContent }
            ]
        });

        res.status(200).json(this.generateResponse(200, "New Chat Created", chat));
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

    static getChatById = asyncHandler(async (req, res) => {
        const { id } = req.params;

        if (!id) {
            res.status(400);
            throw new Error('Chat ID is required');
        }

        const chat = await ChatModel.findById(id);

        if (!chat) {
            res.status(404);
            throw new Error('Chat not found');
        }

        return res.status(200).json(
            this.generateResponse(200, 'Chat fetched successfully', chat)
        );
    });

    static DeleteChatById = asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400);
                throw new Error('Chat ID is required');
            }

            const deleted = await ChatModel.findByIdAndDelete(id);

            if (!deleted) {
                res.status(404);
                throw new Error('Chat not found');
            }

            res.status(200).json(this.generateResponse(200, 'Chat deleted successfully'));
        }

        catch (error) {
            res.status(400);
            throw new Error("Error deleting chat: " + error.message);
        }
    });

}

export default GenerateContent;
