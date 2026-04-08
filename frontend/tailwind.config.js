/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#3B82F6',
                secondary: '#F59E0B',
                accent: '#EF4444',
                background: '#F3F4F6',
            },
        },
    },
    plugins: [],
};