/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        panel: "#f6f7f9",
        line: "#d8dee8",
        signal: "#0f766e",
        amber: "#b45309",
        berry: "#9f1239",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(24, 33, 47, 0.08)",
      },
    },
  },
  plugins: [],
};

