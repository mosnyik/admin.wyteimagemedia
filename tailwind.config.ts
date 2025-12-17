import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      keyframes: {
     
        spinColor: {
          "0%": {
            transform: "rotate(0deg)",
            color: "#ffd700",
          },
          "25%": {
            transform: "rotate(90deg)",
            color: "#cdea68",
          },
          "50%": {
            transform: "rotate(180deg)",
            color: "#004d43",
          },
          "75%": {
            transform: "rotate(270deg)",
            color: "#9bb83f",
          },
          "100%": {
            transform: "rotate(360deg)",
            color: "#333",
          },
        },
      },

      animation: {
        underline2: "underlineAnimation2 0.6s ease-in-out",
        spinColor: "spinColor 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
