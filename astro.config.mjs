import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    tailwind(),
    react({
      // Opcional: configura SSR, etc.
      // See: https://docs.astro.build/en/guides/integrations-guide/react/
    }),
  ],
});
