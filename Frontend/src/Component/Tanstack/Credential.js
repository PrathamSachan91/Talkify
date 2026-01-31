import axios  from "axios";
export const fetchMe = async () => {
  const res = await axios.get("http://localhost:3001/api/auth/me", {
    withCredentials: true,
  });
  return res.data.user;
};