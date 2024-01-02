import { PlaneLanding } from "lucide-react";
import type { Config } from "tailwindcss";

const palette = {
    transparent: "transparent",
    white: "#ffffff",
    black: "#000000",
    gray: {
        100: "#f8f9fa",
        200: "#e9ecef",
        300: "#dee2e6",
        400: "#ced4da",
        500: "#adb5bd",
        600: "#6C757D",
        700: "#495057",
        800: "#343a40",
        900: "#212529",
    },
    green: {
        100: "#CBFFE9",
        200: "#32FFA8",
        300: "#20C997",
        400: "#26CB7E",
        500: "#1FA969",
        600: "#198754",
        700: "#13653F",
        800: "#0C442A",
        900: "#062215",
    },
    blue: {
        100: "#C9DFFF",
        200: "#93BFFE",
        300: "#5E9EFE",
        400: "#3888FD",
        500: "#0D6EFD",
        600: "#0455CF",
        700: "#0949a9",
        800: "#063170",
        900: "#031838",
    },
    red: {
        100: "#F7D2D6",
        200: "#32FFA8",
        300: "#E87883",
        400: "#E04B5A",
        500: "#DC3545",
        600: "#C42F3D",
        700: "#93232E",
        800: "#62181F",
        900: "#310C0F",
    },
    yellow: {
        100: "#FFF1C8",
        200: "#ffe391",
        300: "#FFD65A",
        400: "#FFD249",
        500: "#FFC107",
        600: "#E3AC06",
        700: "#AA8105",
        800: "#715603",
        900: "#392B02",
    },
};

const commonColors = {
    transparent: palette.transparent,
    white: palette.white,
    black: palette.black,
    accent: {
        DEFAULT: palette.blue[500],
        dark: palette.blue[700],
        light: palette.blue[100],
    },
    positive: {
        DEFAULT: palette.green[600],
        dark: palette.green[700],
        light: palette.green[100],
    },
    negative: {
        DEFAULT: palette.red[500],
        dark: palette.red[700],
        light: palette.red[100],
    },
    warning: {
        DEFAULT: palette.yellow[500],
        dark: palette.yellow[700],
        light: palette.yellow[100],
    },
};

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        colors: {
            ...palette,
            ...commonColors,
        },
        backgroundColor: {
            ...commonColors,
            primary: palette.white,
            secondary: palette.gray[200],
            ternary: palette.gray[100],
            disabled: palette.gray[400],
            nouns: palette.yellow[400],
        },
        textColor: {
            ...commonColors,
            primary: palette.gray[900],
            secondary: palette.gray[600],
        },
        borderColor: {
            ...commonColors,
            primary: palette.gray[400],
            secondary: palette.gray[200],
        },
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            fontFamily: {
                pt: ["var(--font-pt-root-ui)"],
                londrina: ["var(--font-londrina-solid)"],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
