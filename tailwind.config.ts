// tailwind.config.ts
const { nextui } = require("@nextui-org/react");

import type { Config } from 'tailwindcss'

export default {
  content: [
    // ...
    // make sure it's pointing to the ROOT node_module
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()]
} satisfies Config