import { getAllUsers } from '../../api/users.api'

export default {
    namespaced: true,

    state: {
        players: [],
    },

    mutations: {
        setPlayers(state, players) {
            state.players = players
        },
    },

    getters: {
        sortedPlayers: (state) => {
            const playersCopy = state.players.slice()

            playersCopy.sort(function (playerA, playerB) {
                return playerB.totalBooks - playerA.totalBooks
            })

            return playersCopy
        },
    },

    actions: {
        async fetchPlayers(context) {
            const users = await getAllUsers()
            context.commit('setPlayers', users)
        },
    },
}