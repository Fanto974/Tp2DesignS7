import { getAllUsers, updateUserTotalBooks } from '../../api/users.api'
import { getSaveByUserId, createSave, updateSave } from '../../api/saves.api'

export default {
    namespaced: true,

    state: {
        users: [],
    },

    mutations: {
        setUsers(state, users) {
            state.users = users
        },
    },

    actions: {
        async fetchUsers(context) {
            const users = await getAllUsers()
            context.commit('setUsers', users)
        },

        async setPlayerScore(context, payload) {
            const userId = payload.userId
            const newTotalBooks = payload.newTotalBooks

            await updateUserTotalBooks(userId, newTotalBooks)

            const save = await getSaveByUserId(userId)

            if (save === null) {
                await createSave(userId, {
                    books: newTotalBooks,
                    totalBooks: newTotalBooks,
                    ownedUpgrades: {},
                })
            } else {
                await updateSave(save.id, {
                    books: newTotalBooks,
                    totalBooks: newTotalBooks,
                    ownedUpgrades: save.ownedUpgrades,
                })
            }

            await context.dispatch('fetchUsers')
        },

        async resetPlayer(context, userId) {
            await updateUserTotalBooks(userId, 0)

            const save = await getSaveByUserId(userId)

            if (save === null) {
                await createSave(userId, { books: 0, totalBooks: 0, ownedUpgrades: {} })
            } else {
                await updateSave(save.id, { books: 0, totalBooks: 0, ownedUpgrades: {} })
            }

            await context.dispatch('fetchUsers')
        },
    },
}
