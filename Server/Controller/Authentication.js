import bcrypt from "bcrypt";
import Authentication from "../models/Authentication.js";

export const Signin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    // Check if user already exists
    const exists = await Authentication.findOne({
      where: { email },
    });

    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await Authentication.create({
      user_name: name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        auth_id: user.auth_id,
        user_name: user.user_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
