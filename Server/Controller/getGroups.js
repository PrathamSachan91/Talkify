import { Conversation, ConversationMember } from "../models/index.js";

export const getMyGroups = async (req, res) => {
  const me = req.user.auth_id;

  const groups = await Conversation.findAll({
    where: { type: "group" },
    include: {
      model: ConversationMember,
      as: "members",
      where: { user_id: me },
      attributes: [],
    },
    attributes: ["conversation_id", "group_name"],
  });

  res.json(groups);
};
