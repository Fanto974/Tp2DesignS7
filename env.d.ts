/// <reference types="vite/client" />

// Le package.json de vuex@4 ne déclare pas correctement ses types pour la résolution
// "bundler" de TypeScript. On indique ici où trouver les types à la main.
declare module 'vuex' {
    export * from 'vuex/types/index.d.ts'
}
