// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxt/eslint',
        '@nuxt/ui',
        '@nuxtjs/supabase'
    ],

    supabase: {
        redirect: false
    },

    devtools: {
        enabled: true
    },

    css: ['~/assets/css/main.css'],

    routeRules: {
        '/': { prerender: false }
    },

    runtimeConfig: {
        stripeSecretKey: process.env.STRIPE_SECRET_KEY,
        stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        public: {
            siteUrl: process.env.SITE_URL || 'http://localhost:3000',
            supabase: {
                url: process.env.SUPABASE_URL,
                key: process.env.SUPABASE_KEY
            }
        }
    },

    compatibilityDate: '2025-01-15',

    eslint: {
        config: {
            stylistic: {
                commaDangle: 'never',
                braceStyle: '1tbs'
            }
        }
    }
})
