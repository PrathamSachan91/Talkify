import api from "../api/api";

/* Fetch all users */
export const fetchUsers = async () => {
  const res = await api.get("/ChatList");
  return res.data.users;
};

/* Get or create conversation */
export const getConversation = async (userId) => {
  const res = await api.post("/chat/conversation", { userId });
  return res.data;
};

/* Fetch messages of a conversation */
export const fetchMessages = async (conversationId) => {
  const res = await api.get(`/chat/messages/${conversationId}`);
  return res.data; 
};


/* Send a message */
// export const sendMessage = async (data) => {
//   const res = await api.post("/chat/message", data);
//   return res.data;
// };
export const sendMessage = async ({ conversationId, text, images }) => {
  const formData = new FormData();
  formData.append("conversationId", conversationId);

  if (text) formData.append("text", text);
  images.forEach((img) => formData.append("images", img));

  const res = await api.post("/chat/message", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};


/* Fetch conversation meta */
export const fetchConversationMeta = async (conversationId) => {
  const res = await api.get(`/chat/conversation/${conversationId}`);
  return res.data;
};

/* Fetch user by id */
export const fetchUserById = async (userId) => {
  const res = await api.get(`/user/${userId}`);
  return res.data;
};
