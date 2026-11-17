// @ts-check
import { defineConfig } from 'astro/config';
import config from './src/config/config.json';

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url,
  trailingSlash: config.site.trailing_slash ? 'always' : 'ignore',
  devToolbar: { enabled: false },
  vite: {
    // pre-bundle the animation libraries so the first dev page load registers
    // GSAP plugins before the interaction runtime (public/js/webflow.js) starts
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText', 'lenis'],
    },
  },
});
