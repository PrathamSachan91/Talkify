import Authentication from "./Authentication.js";
import Conversation from "./Conversation.js";
import Message from "./Message.js";

/* Conversation ↔ Users */
Conversation.belongsTo(Authentication, {
  as: "user1",
  foreignKey: "user1_id",
});

Conversation.belongsTo(Authentication, {
  as: "user2",
  foreignKey: "user2_id",
});

/* Conversation ↔ Messages */
Conversation.hasMany(Message, {
  foreignKey: "conversation_id",
  as: "messages",
});

Message.belongsTo(Conversation, {
  foreignKey: "conversation_id",
});

Message.belongsTo(Authentication, {
  foreignKey: "sender_id",
});

export {
  Authentication,
  Conversation,
  Message,
};
