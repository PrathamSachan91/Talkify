import { Op } from "sequelize";
import { Conversation, Message, Authentication } from "../models/index.js";
import { getIO } from "../socket.js"; // adjust path if needed

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

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID required" });
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

    let type = "text";
    let image_url = null;
    let cleanText = text?.trim() || null;

    if (req.file) {
      type = "image";
      image_url = `/uploads/chat/${req.file.filename}`;
    }

    if (!cleanText && !image_url) {
      return res.status(400).json({ message: "Empty message" });
    }

    const message = await Message.create({
      conversation_id: conversationId,
      sender_id: me,
      text: cleanText,
      type,
      image_url,
    });

    const io = getIO();
    io.to(`conversation-${conversationId}`).emit("receive_message", message);

    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

/* ---------------- GET CONVERSATION META ---------------- */
export const getConversationMeta = async (req, res) => {
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
      return res.status(404).json({ message: "Conversation not found" });
    }

    const receiverId =
      conversation.user1_id === me
        ? conversation.user2_id
        : conversation.user1_id;

    res.json({
      conversation_id: conversation.conversation_id,
      receiver_id: receiverId,
    });
  } catch (err) {
    console.error("Conversation meta error:", err);
    res.status(500).json({ message: "Failed to load conversation" });
  }
};

export const getUserById = async (req, res) => {
  const user = await Authentication.findByPk(req.params.userId, {
    attributes: ["auth_id", "user_name"],
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};
