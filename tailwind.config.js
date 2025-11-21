// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",   // app ディレクトリを対象
    "./pages/**/*.{js,ts,jsx,tsx}", // pages ディレクトリを対象（使っていれば）
    "./components/**/*.{js,ts,jsx,tsx}", // components ディレクトリを対象
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: "var(--font-geist-sans)",
        mono: "var(--font-geist-mono)",
      },
    },
  },
  plugins: [],
};
