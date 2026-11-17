/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Optional endpoint that receives form submissions (see src/scripts/forms.ts) */
  readonly PUBLIC_FORM_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  /** Webflow runtime queue / API (public/js/webflow.js) */
  Webflow?: Array<() => void>;
}
