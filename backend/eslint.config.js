import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig({
  files: ["**/*.{js,mjs,cjs}"],
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.jest,
    },
  },
  plugins: {
    js,
  },
  rules: {
    "max-len": ["warn", { code: 300 }],
    "no-unused-vars": ["warn"], // <- Cambiar de "error" a "warn"
  },

  files: ["src/**/*.{js,mjs,cjs}"], // <- solo código principal
  ignores: ["node_modules/**", "dist/**", "coverage/**", "tests/**"],
});
