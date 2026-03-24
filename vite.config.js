import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { presetUno, presetWind, presetAttributify } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS({
      presets: [presetUno(), presetWind(), presetAttributify()],
      transformers: [transformerDirectives()],
      theme: {
        colors: {
          navy: {
            950: '#04071a',
            900: '#0A0F2C',
            800: '#0d1538',
            700: '#111d4a',
            600: '#1a2d6b',
          },
          gold: {
            300: '#f0d080',
            400: '#e0b84a',
            500: '#C9A84C',
            600: '#a8882a',
          },
          surface: '#121830',
          card: '#161d3f',
        },
        fontFamily: {
          display: ['"Playfair Display"', 'serif'],
          body: ['"DM Sans"', 'sans-serif'],
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})