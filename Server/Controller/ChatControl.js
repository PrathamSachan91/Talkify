import { Op } from "sequelize";
import { Conversation, Message } from "../models/index.js";

/* ---------------- GET OR CREATE CONVERSATION ---------------- */
export const getOrCreateConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const me = req.user.auth_id;

    if (!userId || userId === me) {
      return res.status(400).json({ message: "Invalid user" });
    }

    let conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { user1_id: me, user2_id: userId },
          { user1_id: userId, user2_id: me },
        ],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        user1_id: me,
        user2_id: userId,
      });
    }

    res.json(conversation);
  } catch (err) {
    console.error("Conversation error:", err);
    res.status(500).json({ message: "Failed to create conversation" });
  }
};

/* ---------------- FETCH MESSAGES ---------------- */
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const me = req.user.auth_id;

    const conversation = await Conversation.findOne({
      where: {
        conversation_id: conversationId,
        [Op.or]: [{ user1_id: me }, { user2_id: me }],
      },
    });

    if (!conversation) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.findAll({
      where: { conversation_id: conversationId },
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (err) {
    console.error("Fetch messages error:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

/* ---------------- SEND MESSAGE ---------------- */
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const me = req.user.auth_id;
    const cleanText = text?.trim();

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID required" });
    }

    if (!cleanText) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const conversation = await Conversation.findOne({
      where: {
        conversation_id: conversationId,
        [Op.or]: [{ user1_id: me }, { user2_id: me }],
      },
    });

    if (!conversation) {
      return res.status(403).json({ message: "Access denied" });
    }

    const message = await Message.create({
      conversation_id: conversationId,
      sender_id: me,
      text: cleanText,
    });

    res.json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};
