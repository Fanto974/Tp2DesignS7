import { findUserByCredentials, updateUserTotalBooks } from '../../api/users.api'
import { getSaveByUserId, createSave, updateSave } from '../../api/saves.api'

export default {
    namespaced: true,

    state: {
        currentUser: null,
        saveId: null,
    },

    mutations: {
        setUser(state, user) {
            state.currentUser = user
        },

        clearUser(state) {
            state.currentUser = null
            state.saveId = null
        },

        setSaveId(state, saveId) {
            state.saveId = saveId
        },

        setCurrentUserTotalBooks(state, totalBooks) {
            if (state.currentUser) {
                state.currentUser.totalBooks = totalBooks
            }
        },
    },

    getters: {
        isAuthenticated: (state) => state.currentUser !== null,
        isAdmin: (state) => state.currentUser !== null && state.currentUser.role === 'admin',
        username: (state) => (state.currentUser ? state.currentUser.username : ''),
        userId: (state) => (state.currentUser ? state.currentUser.id : null),
    },

    actions: {
        async login({ commit, dispatch }, credentials) {
            const user = await findUserByCredentials(credentials.username, credentials.password)

            if (user === null) {
                return false
            }

            commit('setUser', user)

            const save = await getSaveByUserId(user.id)

            if (save === null) {
                commit('setSaveId', null)
                dispatch('game/loadGame', null, { root: true })
            } else {
                commit('setSaveId', save.id)
                dispatch('game/loadGame', save, { root: true })
            }

            return true
        },

        logout({ commit }) {
            commit('clearUser')
        },

        async saveGame({ state, commit, rootGetters }) {
            if (state.currentUser === null) {
                return
            }

            const saveData = rootGetters['game/saveData']

            if (state.saveId === null) {
                const createdSave = await createSave(state.currentUser.id, saveData)
                commit('setSaveId', createdSave.id)
            } else {
                await updateSave(state.saveId, saveData)
            }

            await updateUserTotalBooks(state.currentUser.id, saveData.totalBooks)
            commit('setCurrentUserTotalBooks', saveData.totalBooks)
        },
    },
}