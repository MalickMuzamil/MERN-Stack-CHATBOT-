import path from "path";
import express from "express";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config({ silent: process.env.NODE_ENV === "production" });
import bodyParser from "body-parser";

import { connectDB } from "./DbConfig/dbConfig.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

import accessRoute from './Routes/accessRoutes.js'
import GenerateRoutes from './Routes/GenerateRoutes.js'

const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
connectDB();
const app = express();
app.use(express.json());

const corsOpts = {
  origin: "*",
};

app.use(cors(corsOpts));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

var jsonParser = bodyParser.json();

app.use("/", accessRoute);
app.use("/generate-content", GenerateRoutes);



app.use(errorHandler);
app.listen(port, () => console.log(`Server started on port ${port}`));
