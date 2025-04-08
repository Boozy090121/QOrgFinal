import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Scan app directory
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Scan components directory (if you create one)
    './*.{js,ts,jsx,tsx}', // Scan root level component files like Sidebar.tsx
  ],
  theme: {
    extend: {
      colors: {
        primary: '#004B87',
        secondary: '#81C341',
        accent: '#F47920',
        light: '#E6EEF4',
        dark: '#002D56',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config; 