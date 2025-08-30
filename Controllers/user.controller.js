import User from "../models/user.js";
import { verifyToken } from "../Middleware/verfiy.token.js";

export const getMe = async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    if (!me) return res.status(404).json({ message: "User not found" });
    const { password, ...safe } = me.toObject();
    res.status(200).json({ user: safe });
  } catch (e) {
    res.status(500).json({ message: "Error fetching profile", error: e.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { name, email } = req.body;
    const update = {};
    if (typeof name === "string") update.name = name;
    if (typeof email === "string") update.email = email.toLowerCase();

    if (update.email) {
      const exists = await User.findOne({ email: update.email, _id: { $ne: req.user.id } });
      if (exists) return res.status(409).json({ message: "Email already exists" });
    }

    const me = await User.findByIdAndUpdate(req.user.id, update, { new: true });
    if (!me) return res.status(404).json({ message: "User not found" });
    const { password, ...safe } = me.toObject();
    res.status(200).json({ message: "Profile updated", user: safe });
  } catch (e) {
    res.status(500).json({ message: "Error updating profile", error: e.message });
  }
};

export default { getMe, updateMe };