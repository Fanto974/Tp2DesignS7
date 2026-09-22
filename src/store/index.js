import { createStore } from 'vuex'
import game from './modules/game'
import auth from './modules/auth'
import leaderboard from './modules/leaderboard'
import admin from './modules/admin'
import challenge from './modules/challenge'
import autosave from './plugins/autosave'

export default createStore({
    strict: import.meta.env.DEV,
    modules: {
        game,
        auth,
        leaderboard,
        admin,
        challenge,
    },
    plugins: [autosave],
})