import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import bookingsRouter from "./routes/bookings";
import experiencesRouter from "./routes/experiences";
import promoRouter from "./routes/promo";

dotenv.config();

const app = express();

// Support a comma-separated list of allowed origins via FRONTEND_URLS or a single FRONTEND_URL.
// Example: FRONTEND_URLS="https://app.example.com,http://localhost:5173"
const rawAllowed = process.env.FRONTEND_URLS ?? process.env.FRONTEND_URL ?? "http://localhost:5173";
const allowedOrigins = rawAllowed.split(",").map((s) => s.trim()).filter(Boolean);

app.use(cors({
  origin: (incomingOrigin, callback) => {
    // If no origin (e.g., server-to-server requests, Postman), allow.
    if (!incomingOrigin) return callback(null, true);
    if (allowedOrigins.includes(incomingOrigin)) return callback(null, true);
    // For diagnostics, provide a helpful message in the CORS error.
    return callback(new Error(`Origin ${incomingOrigin} not allowed by CORS`));
  },
  credentials: true,
}));

app.use(express.json());

app.use("/api/bookings", bookingsRouter);
app.use("/api/experiences", experiencesRouter);
app.use("/api/promo", promoRouter);

export default app;
