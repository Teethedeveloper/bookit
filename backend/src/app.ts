import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import bookingsRouter from "./routes/bookings";
import experiencesRouter from "./routes/experiences";
import promoRouter from "./routes/promo";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/bookings", bookingsRouter);
app.use("/api/experiences", experiencesRouter);
app.use("/api/promo", promoRouter);

export default app;
