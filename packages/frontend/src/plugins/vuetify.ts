import { createVuetify } from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {

      // ─────────────────────────────────────────────
      // LIGHT — Profissional, limpo, tech corporativo
      // ─────────────────────────────────────────────
      light: {
        dark: false,
        colors: {
          // Identidade visual
          primary:   '#030B29',   // Azul navy profundo — autoridade, tech
          secondary: '#4276FF',   // Azul elétrico — ação, destaque, CTA
          accent:    '#003A91',   // Azul institucional — marca, links ativos

          // Status
          success: '#2FBF71',     // Verde moderno
          error:   '#E5533D',     // Vermelho suave
          warning: '#F4A261',     // Laranja elegante
          info:    '#4276FF',     // Espelha o secondary

          // Backgrounds e superfícies
          background:         '#F4F6FB',  // Levemente azulado — mais tech que cinza puro
          surface:            '#FFFFFF',  // Cards, modais
          'surface-variant':  '#DEE7FF',  // Chips selecionáveis, badges
          'on-surface-variant': '#323951',// Texto/ícone sobre superfície variante

          // Tipografia sobre cada base
          'on-primary':    '#FFFFFF',
          'on-secondary':  '#FFFFFF',
          'on-background': '#0D1333',   // Quase navy, mais suave que preto
          'on-surface':    '#1A2040',   // Texto principal sobre cards

          // Utilitários
          outline:  '#DDE3F0',   // Bordas, divisores (tom azulado, não cinza neutro)
          medium:   '#6B748F',   // Textos de apoio, ícones secundários
          disabled: '#EFF1F8',   // Estados desativados, chips inativos
        },
      },

      // ─────────────────────────────────────────────
      // DARK — Terminal tech, noturno, alta densidade
      // ─────────────────────────────────────────────
      dark: {
        dark: true,
        colors: {
          // Identidade visual (mais brilhantes para contrastar no escuro)
          primary:   '#4276FF',   // Azul elétrico vira o primário no dark
          secondary: '#6B96FF',   // Versão mais clara do elétrico — hover, destaque
          accent:    '#7EB2FF',   // Azul céu — links ativos, elementos de marca

          // Status (ligeiramente mais saturados para contrastar no fundo escuro)
          success: '#34D399',     // Verde esmeralda neon
          error:   '#F87171',     // Vermelho rosado
          warning: '#FBBF24',     // Âmbar
          info:    '#60A5FA',     // Azul suave

          // Backgrounds e superfícies (camadas de profundidade)
          background:         '#080D1E',   // Azul-negro profundo — base
          surface:            '#0E1530',   // Cards e modais — um degrau acima
          'surface-variant':  '#1A2448',   // Chips, badges, inputs
          'on-surface-variant': '#8FA3D8', // Texto/ícone sobre superfície variante

          // Tipografia sobre cada base
          'on-primary':    '#FFFFFF',
          'on-secondary':  '#080D1E',
          'on-background': '#C8D6F5',   // Branco azulado — menos agressivo que branco puro
          'on-surface':    '#E2EAFF',   // Texto principal sobre cards

          // Utilitários
          outline:  '#1E2D52',   // Bordas sutis — barely visible, elegante
          medium:   '#5A6E9E',   // Ícones e textos de apoio
          disabled: '#151E3A',   // Elementos desativados — quase some no fundo
        },
      },

    },
  },
})