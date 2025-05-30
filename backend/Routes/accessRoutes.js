import express from "express";
const router = express.Router();

import AccessController from "../Controllers/AccessController.js";

router.get("/", AccessController.ApiWorking);
router.get("/validate", AccessController.validate);
router.post("/signup", AccessController.signup);
router.post("/login", AccessController.login);

export default router;
