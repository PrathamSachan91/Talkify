import express from "express";
import { Signin, Login,getUser,Logout,googleLogin } from "../Controller/Authentication.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getAllUsers } from "../Controller/Chatlist.js";
import { getMessages, getOrCreateConversation, sendMessage } from "../Controller/ChatControl.js";

const router = express.Router();

router.post("/auth/signin", Signin);
router.post("/auth/login", Login);
router.get("/auth/me" ,requireAuth, getUser);
router.get("/auth/logout",Logout,requireAuth);
router.post("/auth/google",googleLogin)
router.get("/ChatList",requireAuth,getAllUsers);
router.post("/chat/conversation",requireAuth,getOrCreateConversation);
router.get("/chat/messages/:conversationId",requireAuth,getMessages);
router.post("/chat/message",requireAuth,sendMessage);
export default router;
