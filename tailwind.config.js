/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bionic: {
          blue: "#0EA5E9",
          cyan: "#06B6D4",
          dark: "#050A14",
          panel: "#0A1628",
          card: "#0D1F3C",
          border: "#1E3A5F",
          green: "#10B981",
          amber: "#F59E0B",
          red: "#EF4444",
        }
      },
      fontFamily: {
        display: ["'Orbitron'", "monospace"],
        body: ["'Exo 2'", "sans-serif"],
        mono: ["'Share Tech Mono'", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan": "scan 2s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" }
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #0EA5E9, 0 0 10px #0EA5E9" },
          "100%": { boxShadow: "0 0 20px #0EA5E9, 0 0 40px #06B6D4" }
        }
      }
    }
  },
  plugins: []
};
