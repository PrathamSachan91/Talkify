import express from "express";
import { Signin, Login } from "../Controller/Authentication.js";

const router = express.Router();

router.post("/auth/signin", Signin);
router.post("/auth/login", Login);

export default router;
