import express from "express";
import { Signin, Login,getUser,Logout } from "../Controller/Authentication.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/auth/signin", Signin);
router.post("/auth/login", Login);
router.get("/auth/me" ,requireAuth, getUser);
router.post("/auth/logout",Logout,requireAuth);

export default router;
