import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load .env files based on mode (development or production)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Replace import.meta.env.VITE_API_URL in code with the value
      "import.meta.env.VITE_API_URL": JSON.stringify(
        env.VITE_API_URL || "http://localhost:5000"
      ),
    },
  };
});

