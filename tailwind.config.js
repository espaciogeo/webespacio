/** @type {import('tailwindcss').Config} */
// Los valores viven en src/styles/tokens.css; Tailwind solo los referencia.
const c = (v) => `rgb(var(${v}) / <alpha-value>)`;
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: c('--c-paper'), 'paper-2': c('--c-paper-2'), 'paper-3': c('--c-paper-3'),
        ink: c('--c-ink'), 'ink-soft': c('--c-ink-soft'), 'ink-light': c('--c-ink-light'),
        'ink-2': c('--c-gray'), 'ink-3': c('--c-gray'),
        accent: c('--c-accent'), 'accent-dark': c('--c-accent-dark'), 'accent-ink': c('--c-accent-ink'), error: c('--c-error'),
        pencil: c('--c-accent'), ochre: c('--c-accent'), 'ochre-dark': c('--c-accent-dark'), night: c('--c-ink'),
      },
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Roboto Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { sm: 'var(--r-sm)', md: 'var(--r-md)', DEFAULT: 'var(--r)', lg: 'var(--r-lg)' },
      fontSize: {
        mono: ['var(--fs-mono)', { lineHeight: '1.4' }],
        small: ['var(--fs-small)', { lineHeight: '1.5' }],
        body: ['var(--fs-body)', { lineHeight: '1.6' }],
        reading: ['var(--fs-reading)', { lineHeight: '1.6' }],
        lead: ['var(--fs-lead)', { lineHeight: '1.45' }],
        h4: ['var(--fs-h4)', { lineHeight: '1.2' }],
        h3: ['var(--fs-h3)', { lineHeight: '1.12' }],
        h2: ['var(--fs-h2)', { lineHeight: '1.02' }],
        stat: ['var(--fs-stat)', { lineHeight: '1' }],
      },
      // Montserrat solo en normal (400) o semi negrita (600): font-bold se dibuja a 600
      fontWeight: { bold: '600', extrabold: '600', black: '600' },
      screens: { xs: '420px' },
    },
  },
  plugins: [],
};
