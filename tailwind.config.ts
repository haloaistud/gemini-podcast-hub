import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--foreground))",
          dark: "hsl(var(--primary-dark))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--foreground))",
          dark: "hsl(var(--secondary-dark))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--foreground))",
          dark: "hsl(var(--accent-dark))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--foreground))",
          dark: "hsl(var(--success-dark))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--foreground))",
          light: "hsl(var(--warning-light))",
        },
        live: "#dc2626",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        glass: {
          DEFAULT: "hsl(var(--glass-bg))",
          border: "hsl(var(--glass-border))",
          hover: "hsl(var(--glass-hover))",
        },
      },
      backdropBlur: {
        glass: "20px",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-secondary": "var(--gradient-secondary)",
        "gradient-accent": "var(--gradient-accent)",
        "gradient-success": "var(--gradient-success)",
        "gradient-warning": "var(--gradient-warning)",
        "gradient-dark": "var(--gradient-dark)",
        "gradient-rainbow": "var(--gradient-rainbow)",
        "gradient-mesh": "var(--gradient-mesh)",
      },
      boxShadow: {
        "glow-sm": "var(--shadow-sm)",
        "glow-md": "var(--shadow-md)",
        "glow-lg": "var(--shadow-lg)",
        "glow": "var(--shadow-glow)",
        "glow-primary": "var(--shadow-primary)",
        "glow-secondary": "var(--shadow-secondary)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        rotate: {
          "100%": { transform: "rotate(360deg)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.5)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--primary) / 0.8)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-shift": "gradient-shift 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        rotate: "rotate 30s linear infinite",
        fadeIn: "fadeIn 0.5s ease-in-out",
        glow: "glow 2s ease-in-out infinite",
        gradientShift: "gradientShift 4s ease-in-out infinite",
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
