import express from "express";
import { createBooking } from "../controllers/bookingsController";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const booking = await createBooking(req.body);
    // Set a secure, HttpOnly cookie with the created booking id (useful as a lightweight server-side confirmation).
    // Do not store sensitive data in cookies. This cookie only contains a booking identifier.
    try {
      res.cookie("booking_id", booking.id, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });
    } catch (err) {
      // If cookie setting fails for any reason, continue and still return the booking
      console.warn("Failed to set booking cookie", err);
    }
    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

