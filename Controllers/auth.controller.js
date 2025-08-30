import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { verifyToken } from "../Middleware/verfiy.token.js";

export const registerUser = async (req, res) => {
  try {
  const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    // Basic validation per spec
    const nameOk = typeof name === 'string' && name.trim().length >= 2 && !/[0-9]/.test(name);
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    const passOk = typeof password === 'string' && password.length >= 8;
    if (!nameOk) return res.status(400).json({ message: "Invalid name" });
    if (!emailOk) return res.status(400).json({ message: "Invalid email format" });
    if (!passOk) return res.status(400).json({ message: "Password must be at least 8 characters" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
  // Only allow explicit librarian creation if already authenticated librarian calls a separate endpoint.
  // For open registration, force role to Borrower regardless of client input.
  const newUser = await User.create({ name: name.trim(), email: String(email).toLowerCase(), password: hashed, role: "Borrower" });
    const { password: _p, ...safe } = newUser.toObject();
    res.status(201).json({ message: "User registered successfully", user: safe });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email }).select("+password");
    if (!userData) return res.status(400).json({ message: "Invalid email or password" });
    const ok = await bcrypt.compare(password, userData.password);
    if (!ok) return res.status(400).json({ message: "Invalid email or password" });

  // Resolve JWT secret at runtime with a safe fallback for dev
  const jwtSecret = process.env.JWT || process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
  const token = jwt.sign({ id: userData._id, role: userData.role }, jwtSecret, {
      expiresIn: "7d",
    });
    const { password: _pw, ...rest } = userData.toObject();
    return res.status(200).json({ token, data: rest });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const roleGate = (roles) => (req, res, next) =>
  verifyToken(req, res, () => {
    if (roles.includes(req.user.role)) return next();
    return res.status(401).json({ message: "Access denied" });
  });

// Role gates aligned with spec: only two roles exist
export const verifyLibrarian = roleGate(["Librarian"]);
export const verifyBorrower = roleGate(["Borrower", "Librarian"]);
export const verifyStaffOrBorrower = roleGate(["Borrower", "Librarian"]);

// Optional: endpoint to promote a user to Librarian (must be called by a Librarian)
export const promoteToLibrarian = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });
    const updated = await User.findByIdAndUpdate(userId, { role: "Librarian" }, { new: true });
    if (!updated) return res.status(404).json({ message: "User not found" });
    const { password: _pw, ...safe } = updated.toObject();
    return res.status(200).json({ message: "User promoted to Librarian", user: safe });
  } catch (error) {
    return res.status(500).json({ message: "Failed to promote user", error: error.message });
  }
};