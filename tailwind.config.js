/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // DSP 品牌配色系统
        primary: {
          50: '#fef2f2',
          100: '#fee2e2', 
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#C1272D', // DSP主品牌红色
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        },
        // DSP 配色系统
        dsp: {
          red: '#C1272D',     // 主品牌色
          dark: '#303030',    // 深色
          gray: '#707070',    // 中性灰
          white: '#ffffff'    // 纯白
        },
        // 系统色彩
        background: '#ffffff',
        foreground: '#303030', // 使用DSP深色
        muted: {
          DEFAULT: '#f9fafb',
          foreground: '#707070' // 使用DSP灰色
        },
        border: '#e5e7eb'
      },
      borderColor: {
        // 确保DSP颜色可用于边框
        'dsp-red': '#C1272D',
        'dsp-dark': '#303030',
        'dsp-gray': '#707070',
      },
      fontFamily: {
        // DSP 字体系统
        sans: ['Platypi', 'system-ui', 'sans-serif'],
        display: ['Platypi', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'large': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'apple': '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '24px'
      }
    },
  },
  plugins: [],
}