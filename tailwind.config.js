const {
    colors
} = require('tailwindcss/defaultTheme')

module.exports = {
    purge: [
        './dist/**/*.html',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    base: "#1B5790",
                    light: "#4995DC",
                    dark: "#12395E"
                },
                secondary: {
                    base: "#1c927c",
                    light: "#49DCC1",
                    dark: "#125E50"
                },
                danger: {
                    base: "#1B5790",
                    light: "#FFFFFF",
                    dark: "#CCCCCC"
                },
                background: {
                    base: "#FAFAFA",
                    light: "#FFFFFF",
                    dark: "#E5E5E5"
                },
                fontcolor: {
                    base: "#1B5790",
                    light: "#FFFFFF",
                    dark: "#CCCCCC"
                },

            }
        },
    },
    variants: {},
    plugins: [],
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    }
}