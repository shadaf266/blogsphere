import mongoose from "mongoose";
import ContactMessage from "../models/ContactMessage.js";
import asyncHandler from "../utils/asyncHandler.js";

// POST /api/v1/inquiries (public)
export const createInquiry = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error("Name, email, subject and message are required");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    res.status(400);
    throw new Error("Enter a valid email address");
  }
  await ContactMessage.create({ name, email, subject, message });
  res.status(201).json({ success: true, message: "Thanks! Your message has been sent.", data: null });
});

// GET /api/v1/admin/inquiries
export const getInquiries = asyncHandler(async (req, res) => {
  const filter = {};
  if (["new", "read", "resolved"].includes(req.query.status)) filter.status = req.query.status;
  const inquiries = await ContactMessage.find(filter).sort("-createdAt").limit(100);
  res.json({ success: true, message: "Inquiries retrieved", data: inquiries });
});

// PATCH /api/v1/admin/inquiries/:id/status
export const setInquiryStatus = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  if (!["new", "read", "resolved"].includes(req.body.status)) {
    res.status(400);
    throw new Error("Status must be new, read or resolved");
  }
  const inquiry = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!inquiry) {
    res.status(404);
    throw new Error("Inquiry not found");
  }
  res.json({ success: true, message: "Status updated", data: inquiry });
});