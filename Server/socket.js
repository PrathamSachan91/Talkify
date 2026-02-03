import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Conversation } from "./models/index.js";
import { Op } from "sequelize";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.access_token;

    if (!token) return next(new Error("Unauthorized"));

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.user.auth_id);

    socket.on("join_conversation", async (conversationId) => {
      const convo = await Conversation.findOne({
        where: {
          conversation_id: conversationId,
          [Op.or]: [
            { user1_id: socket.user.auth_id },
            { user2_id: socket.user.auth_id },
          ],
        },
      });

      if (!convo) return;
      socket.join(`conversation-${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.user.auth_id);
    });
  });

  return io;
};

export const getIO = () => io;

