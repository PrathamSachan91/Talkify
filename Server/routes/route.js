import express from "express";
import { Signin, Login,getUser,Logout,googleLogin } from "../Controller/Authentication.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getAllUsers } from "../Controller/Chatlist.js";

const router = express.Router();

router.post("/auth/signin", Signin);
router.post("/auth/login", Login);
router.get("/auth/me" ,requireAuth, getUser);
router.get("/auth/logout",Logout,requireAuth);
router.post("/auth/google",googleLogin)
router.get("/ChatList",requireAuth,getAllUsers)
export default router;
