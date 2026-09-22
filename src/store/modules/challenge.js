import { getAllChallenges, createChallenge, finishChallenge } from '../../api/challenges.api'

export default {
    namespaced: true,

    state: {
        challenges: [],
    },

    mutations: {
        setChallenges(state, challenges) {
            state.challenges = challenges
        },
    },

    getters: {
        myChallenges: (state, getters, rootState, rootGetters) => {
            const userId = rootGetters['auth/userId']
            const myChallengesList = []

            for (let i = 0; i < state.challenges.length; i++) {
                const challenge = state.challenges[i]
                if (challenge.challengerId === userId || challenge.opponentId === userId) {
                    myChallengesList.push(challenge)
                }
            }

            return myChallengesList
        },
    },

    actions: {
        async fetchChallenges(context) {
            const challenges = await getAllChallenges()
            context.commit('setChallenges', challenges)
        },

        async sendChallenge(context, payload) {
            const userId = context.rootGetters['auth/userId']
            const username = context.rootGetters['auth/username']
            const myTotalBooks = context.rootGetters['game/stats'].totalBooks

            const newChallenge = {
                challengerId: userId,
                challengerName: username,
                challengerStart: myTotalBooks,
                opponentId: payload.opponentId,
                opponentName: payload.opponentName,
                opponentStart: payload.opponentTotalBooks,
                targetBooks: payload.targetBooks,
            }

            await createChallenge(newChallenge)
            await context.dispatch('fetchChallenges')
        },

        async checkChallenges(context) {
            const userId = context.rootGetters['auth/userId']
            const username = context.rootGetters['auth/username']
            const myTotalBooks = context.rootGetters['game/stats'].totalBooks
            const challenges = context.state.challenges

            let somethingChanged = false

            for (let i = 0; i < challenges.length; i++) {
                const challenge = challenges[i]

                if (challenge.status !== 'open') {
                    continue
                }

                let myStart = null
                if (challenge.challengerId === userId) {
                    myStart = challenge.challengerStart
                } else if (challenge.opponentId === userId) {
                    myStart = challenge.opponentStart
                }

                if (myStart === null) {
                    continue
                }

                const myProgress = myTotalBooks - myStart

                if (myProgress >= challenge.targetBooks) {
                    await finishChallenge(challenge.id, userId, username)
                    somethingChanged = true
                }
            }

            if (somethingChanged) {
                await context.dispatch('fetchChallenges')
            }
        },
    },
}