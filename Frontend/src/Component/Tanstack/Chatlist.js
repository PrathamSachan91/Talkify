import api from "../api/api";

export const fetchUsers = async () => {
  const res = await api.get("/ChatList");
  return res.data.users;
};
