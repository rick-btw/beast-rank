import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "#05070b",
        panel: "#0b1118",
        ink: "#e7fff3",
        acid: "#69ff72",
        cyan: "#48e6ff",
        magenta: "#ff3da8",
        amber: "#ffb84d"
      },
      boxShadow: {
        neon: "0 0 24px rgba(105, 255, 114, 0.28)",
        cyan: "0 0 24px rgba(72, 230, 255, 0.2)",
        magenta: "0 0 22px rgba(255, 61, 168, 0.2)"
      },
      backgroundImage: {
        "circuit-grid":
          "linear-gradient(rgba(105,255,114,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(72,230,255,.08) 1px, transparent 1px)",
        "panel-sheen":
          "linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.01) 42%, rgba(105,255,114,.08))"
      }
    }
  },
  plugins: []
};

export default config;
