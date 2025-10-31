import dotenv from "dotenv";

// Load environment variables as early as possible so imported modules
// (like integrations/supabase) can read them during their initialization.
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

