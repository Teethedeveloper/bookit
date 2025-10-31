import express from "express";
import { createBooking } from "../controllers/bookingsController";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const booking = await createBooking(req.body);
    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

