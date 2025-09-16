/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,html}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // .text-primary, .bg-primary, .hover:text-blue-700
          light: '#3b82f6',   // .hover:bg-blue-700, .text-blue-700
        },
        secondary: {
          DEFAULT: '#374151', // .text-gray-700, .border-gray-300
        },
        success: {
          DEFAULT: '#16a34a', // .text-green-600, .bg-green-500, .bg-green-100
          light: '#d1fae5',
        },
        warning: {
          DEFAULT: '#f59e42', // .text-yellow-700, .bg-yellow-100, .border-yellow-400
          light: '#fef3c7',
        },
        error: {
          DEFAULT: '#dc2626', // .text-red-600, .bg-red-100
          light: '#fef2f2',
        },
        info: {
          DEFAULT: '#3b82f6', // .text-blue-600, .bg-blue-100
          light: '#eff6ff',
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
        purple: {
          100: '#f3e8ff',
          600: '#9333ea',
        },
        orange: {
          100: '#ffedd5',
          600: '#ea580c',
        },
      },
      fontFamily: {
        // Airbnb's Cereal font, with fallbacks
        sans: ['Cereal', 'Inter', 'Lato', 'Open Sans', 'ui-sans-serif', 'system-ui'],
        heading: ['Cereal', 'Lato', 'Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['Fira Mono', 'Menlo', 'monospace'],
      },
      maxWidth: {
        '4xl': '56rem',
        '7xl': '80rem',
        'screen-xl': '1280px',
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(0,0,0,0.04)',
        banner: '0 4px 16px 0 rgba(0,0,0,0.08)',
        btn: '0 1px 2px 0 rgba(0,0,0,0.06)',
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1a202c',
            a: {
              color: '#3b82f6',
              '&:hover': {
                color: '#1e3a8a',
              },
            },
            h1: {
              fontFamily: 'Lato',
              fontWeight: '700',
              color: '#1a202c',
            },
            h2: {
              fontFamily: 'Lato',
              fontWeight: '600',
              color: '#374151',
            },
            h3: {
              fontFamily: 'Lato',
              fontWeight: '600',
              color: '#374151',
            },
            strong: {
              color: '#1a202c',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};