import express from "express";
import { getExperiences, getExperienceById } from "../controllers/experiencesController";

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

export default router;

