import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import topLevelAwait from "vite-plugin-top-level-await";
// https://vitejs.dev/config/
export default defineConfig({
    define: {
        global: {}
    },
    plugins: [react(), tsconfigPaths(), topLevelAwait()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    "material": ['@mui/material']
                }
            }
        }
    }
})
