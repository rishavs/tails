/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.js"],
    daisyui: {
        themes: [
            "light",
            "dark",
            "cupcake",
            "bumblebee",
            "emerald",
            "corporate",
            "synthwave",
            "retro",
            "cyberpunk",
            "valentine",
            "halloween",
            "garden",
            "forest",
            "aqua",
            "lofi",
            "pastel",
            "fantasy",
            "wireframe",
            "black",
            "luxury",
            "dracula",
            "cmyk",
            "autumn",
            "business",
            "acid",
            "lemonade",
            "night",
            "coffee",
            "winter",
            "dim",
            "nord",
            "sunset",
            {
                wintermoon: {
                    ...require("daisyui/src/theming/themes")["winter"],
                    "info": "#0284c7",
                    "info-content": "#ffffff",
                    "error": "#f472b6",
                    "warning": "#ead173",

                },
            },
            {
                lux: {
                    ...require("daisyui/src/theming/themes")["pastel"],
                    "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
                    "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
                    "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
                    "--animation-btn": "0.25s", // duration of animation when you click on button
                    "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
                    "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
                    "--border-btn": "1px", // border width of buttons
                    "--tab-border": "1px", // border width of tabs
                    "--tab-radius": "0.5rem", // border radius of tabs
                },
            },
            {
                darksun: {
                    ...require("daisyui/src/theming/themes")["dark"],
                    "primary": "#0f172a",
                    "primary-content": "#ffffff",

                    "error": "#f472b6",
                    "neutral": "#0369a1",
                    "neutral-content": "#f1f5f9",
                    "base-100": "#1e293b",
                    "base-200": "#0f172a",
                    "base-300": "#020617",
                },
            },
            {
                aquafina: {
                    ...require("daisyui/src/theming/themes")["pastel"],
                    "error": "#f472b6",
                    "warning": "#ead173",
                    "neutral": "#1e293b",
                    "neutral-content": "#eeeeff",

                    "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
                    "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
                    "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
                    "--animation-btn": "0.25s", // duration of animation when you click on button
                    "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
                    "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
                    "--border-btn": "1px", // border width of buttons
                    "--tab-border": "1px", // border width of tabs
                    "--tab-radius": "0.5rem", // border radius of tabs
                },
            },
        ],
    },
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
        require("daisyui"),
    ],
}

