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
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed, role });
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

export const verifyLibrarian = roleGate(["Librarian", "Admin"]);
export const verifyBorrower = roleGate(["Borrower", "User", "Librarian", "Admin"]);
export const verifyAdmin = roleGate(["Admin"]);
export const verifyUser = roleGate(["User", "Librarian", "Admin", "Borrower"]);
// Combined gate for actions allowed to staff or borrowers (e.g., processing returns)
export const verifyStaffOrBorrower = roleGate(["Borrower", "Librarian", "Admin"]);