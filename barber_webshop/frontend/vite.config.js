import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [tailwindcss(), vue()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        login: "login.html",
        management: "management.html",
      },
    },
  },
});
