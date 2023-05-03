/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
            "experimentalDecorators": true,

          isCustomElement: (tag) =>
            [
              "field",
              "block",
              "category",
              "xml",
              "mutation",
              "value",
              "sep",
              "shadow",
            ].includes(tag),
        },
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: fileURLToPath(
            new URL("./node_modules/blockly/media/*", import.meta.url)
          ),
          dest: "media",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
      rollupOptions: {
          input: {
              acornInterpreter: 'src/acorn_interpreter.js',
              blocklyCompressed: 'https://blockly-demo.appspot.com/static/blockly_compressed.js',
              // Weitere Skripte hinzufügen
          }
      },
    // phaser doesn't accept inlined assets
    assetsInlineLimit: 0,
  },
});
