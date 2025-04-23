import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
  },
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:5200',
        changeOrigin: true,
        ws: true,
      },
      "/api": {
        target: "http://localhost:5200",
        changeOrigin: true,
      },
    },
  },
});