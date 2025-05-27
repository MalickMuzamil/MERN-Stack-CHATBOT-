import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import AuthController from "./AuthController.js";

import RoleModel from "../Model/RoleModel.js";
import UserData from "../Model/UserModel.js";

class AccessController extends AuthController {
    static ApiWorking = asyncHandler(async (req, res) => {
        try {
            res.status(200).json(this.generateResponse(200, "ChatBot Api Working"));
        }

        catch (error) {
            res.status(400);
            throw new Error("Api not working");
        }
    });

    static validate = asyncHandler(async (req, res) => {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            try {
                // Get token from header
                token = req.headers.authorization.split(" ")[1];
                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                res
                    .status(200)
                    .json(this.generateResponse(200, "Validated", decoded, token));
            }
            catch (error) {
                res.status(401);
                throw new Error("Authorization Token Not Valid");
            }
        }
        if (!token) {
            res.status(401);
            throw new Error("Authorization Token Not Present");
        }
    });

    static signup = asyncHandler(async (req, res) => {
        try {
            const { first_name, last_name, email, password } = req.body;

            if (!first_name || !last_name || !email || !password) {
                res.status(400);
                throw new Error("Important Fields are required.");
            }

            const userExists = await UserData.findOne({ email: email.toLowerCase(), is_deleted: false });

            if (userExists) {
                console.log(userExists);
                res.status(409);
                throw new Error("User already exists with this email");
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await UserData.create({
                first_name,
                last_name,
                email: email.toLowerCase(),
                password: hashedPassword,
            });

            try {
                await RoleModel.create({
                    userId: newUser._id,
                    role: "AI-User",
                });
            }

            catch (err) {
                res.status(400);
                throw new Error("Failed to assign role");
            }

            const token = this.generateToken(newUser._id);
            const response = this.generateResponse(201, "Signup successful", newUser, token);

            return res.status(201).json(response);
        }

        catch (error) {
            res.status(res.statusCode && res.statusCode !== 200 ? res.statusCode : 400);
            throw new Error(error.message);
        }
    });

    static login = asyncHandler(async (req, res) => {
        try {
            const { email, password } = req.body;
            let user = await UserData.findOne({
                email: email.toLowerCase(),
                is_deleted: false,
            });

            if (!user) {
                res.status(404);
                throw new Error("User not found or has been deleted");
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(403);
                throw new Error("Invalid password");
            }

            let role = await RoleModel.findOne({ userId: user._id });

            if (!role) {
                res.status(404);
                throw new Error("Role not found for the user");
            }

            const token = this.generateToken(user._id)

            const response = this.generateResponse(
                200,
                "Login successful",
                {
                    ...user.toObject(),
                    role: role.role
                },
                token
            );
            return res.status(200).json(response);
        }

        catch (error) {
            res.status(400);
            throw new Error(error);
        }
    });

}

export default AccessController;
