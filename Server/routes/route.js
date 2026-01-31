import express from "express";
import { Signin } from "../Controller/Authentication.js";

const router = express.Router();

router.post("/auth/signin", Signin);

export default router;
