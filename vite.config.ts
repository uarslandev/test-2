import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    publicDir: 'website_data',
    server: {
        host: true,
        port: 2346,
        allowedHosts: ['sit-insight.com', 'www.sit-insight.com', 'localhost', 'www.sit.uarslan.com', 'sit.uarslan.com', '10.0.140.169', 'sitv1.uarslan.com', 'www.sitv1.uarslan.com'],
    },
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})
