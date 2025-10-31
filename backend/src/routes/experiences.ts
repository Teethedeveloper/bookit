import express from "express";
import { getExperiences, getExperienceById, getSlotsByExperience } from "../controllers/experiencesController";

const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const experiences = await getExperiences();
    res.json(experiences);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const experience = await getExperienceById(req.params.id);
    res.json(experience);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Slots for an experience (added so frontend doesn't need to call Supabase directly)
router.get("/:id/slots", async (req, res) => {
  try {
    const slots = await getSlotsByExperience(req.params.id);
    res.json(slots);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

