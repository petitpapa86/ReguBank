/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,html}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        // Professional Banking Theme Colors
        primary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          600: '#1a202c', // dark neutral for headings/text
        },
        secondary: {
          600: '#374151', // for secondary stats
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          800: '#1f2937',
          900: '#111827',
        },
        red: {
          50: '#fef2f2',
          500: '#ef4444', // accent, progress bar, selection
          600: '#dc2626', // CTA, status, step indicator
          700: '#b91c1c', // hover
        },
        green: {
          100: '#d1fae5',
          600: '#16a34a', // success
        },
        blue: {
          50: '#eff6ff',
          500: '#3b82f6', // info badges
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Lato', 'Open Sans', 'ui-sans-serif', 'system-ui'],
      },
      maxWidth: {
        '4xl': '56rem',
        '7xl': '80rem',
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(0,0,0,0.04)',
      },
      borderRadius: {
        lg: '0.75rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};