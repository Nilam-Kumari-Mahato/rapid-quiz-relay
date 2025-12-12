import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), "");

  return { // Return the config object
    server: {
      host: "::",
      port: 8080,
      // Proxy removed
    },
    plugins: [react(), mode === "development" && componentTagger(), tsconfigPaths()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor';
              }
              if (id.includes('@radix-ui') || id.includes('lucide-react')) {
                return 'ui';
              }
              if (id.includes('convex') || id.includes('@convex-dev')) {
                return 'convex';
              }
              if (id.includes('recharts')) {
                return 'charts';
              }
            }
          },
        },
      },
    },
  };
});