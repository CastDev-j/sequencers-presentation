// @ts-check
import { defineConfig, fontProviders, passthroughImageService } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Roboto',
      cssVariable: '--font-main',
      styles: ["normal"]
    }
  ],
  integrations: [react()],
  adapter: cloudflare(),
  image: {
    service: passthroughImageService(),
  },
});