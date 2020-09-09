const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
    purge: [
        './dist/**/*.html',
    ],
    theme: {
        extend: {
            colors: {
                primary: colors.red[500],
                secondary: colors.red[200],
                neutral: colors.gray[200],
                accented: colors.blue[400],
                background: colors.gray[100],
                control: colors.gray[200]
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
