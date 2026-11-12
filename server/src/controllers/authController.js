import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";

const sendAuth = (res, status, user, message) => {
  res.status(status).json({
    success: true,
    message,
    data: {
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
    },
  });
};

// POST /api/v1/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }
  if (await User.findOne({ email: email.toLowerCase() })) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }
  const user = await User.create({ name, email, password });
  sendAuth(res, 201, user, "Account created successfully");
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  if (user.isSuspended) {
    res.status(403);
    throw new Error("Your account has been suspended");
  }
  sendAuth(res, 200, user, "Logged in successfully");
});

// GET /api/v1/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Profile retrieved", data: req.user });
});

// GET /api/v1/auth/verify-token
export const verifyToken = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Token is valid", data: req.user });
});