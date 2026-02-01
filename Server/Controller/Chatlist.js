import Authentication from "../models/Authentication.js";

export const getAllUsers = async (req, res) => {
  const users = await Authentication.findAll({
    attributes: ["auth_id", "user_name", "email"],
  });

  res.json({ users });
};
