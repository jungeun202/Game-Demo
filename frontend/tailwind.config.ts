module.exports = {
  content: [
    './pages/**/*.{html,js,ts,jsx,tsx}', // All files in the pages directory
    './components/**/*.{html,js,ts,jsx,tsx}', // Include components if present
    './styles/**/*.{html,js,ts,jsx,tsx}', // Include styles if Tailwind classes are dynamically used here
  ],
  theme: {
    extend: {
      colors: {
        primary: '#34495E',
        secondary: '#82E0AA',
        accent: '#F5B041',
        text: '#2E4053',
        gradientStart: '#FBF5E6',
        gradientEnd: '#E6F0F8',
      },
      fontFamily: {
        primary: ['Roboto', 'sans-serif'], // Define "primary"
        accent: ['Roboto', 'sans-serif'], // Define "accent"
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },

      
    },
  },
  plugins: [],
};
