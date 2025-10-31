import express from "express";
import { validatePromoCode } from "../controllers/promoController";

const router = express.Router();

router.post("/validate", async (req, res) => {
  try {
    const { code } = req.body;
    const promo = await validatePromoCode(code);
    res.json(promo);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
