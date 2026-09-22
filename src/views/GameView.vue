<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import StatsPanel from '../components/StatsPanel.vue'
import BookButton from '../components/BookButton.vue'
import MultiplierCard from '../components/MultiplierCard.vue'
import UpgradeShop from '../components/UpgradeShop.vue'

const store = useStore()

const myChallenges = computed(function () {
    return store.getters['challenge/myChallenges']
})

const currentUserId = computed(function () {
    return store.getters['auth/userId']
})

const myTotalBooks = computed(function () {
    return store.getters['game/stats'].totalBooks
})

let checkIntervalId: number | null = null

function getOpponentName(challenge: any) {
    if (challenge.challengerId === currentUserId.value) {
        return challenge.opponentName
    }
    return challenge.challengerName
}

function getMyProgress(challenge: any) {
    let start = challenge.opponentStart
    if (challenge.challengerId === currentUserId.value) {
        start = challenge.challengerStart
    }

    const progress = myTotalBooks.value - start

    if (progress < 0) {
        return 0
    }
    return progress
}

onMounted(async function () {
    await store.dispatch('challenge/fetchChallenges')
    await store.dispatch('challenge/checkChallenges')

    checkIntervalId = window.setInterval(function () {
        store.dispatch('challenge/checkChallenges')
    }, 5000)
})

onUnmounted(function () {
    if (checkIntervalId !== null) {
        clearInterval(checkIntervalId)
    }
})
</script>

<template>
    <div class="game-view">
        <StatsPanel />

        <div class="game-main">
            <BookButton />
            <MultiplierCard />
        </div>

        <UpgradeShop />

        <div v-if="myChallenges.length > 0" class="challenges-section">
            <h2>Mes défis</h2>

            <div v-for="challenge in myChallenges" :key="challenge.id" class="challenge-card">
                <p>
                    Contre {{ getOpponentName(challenge) }} : atteindre
                    {{ challenge.targetBooks.toLocaleString('fr-FR') }} livres de plus
                </p>

                <p v-if="challenge.status === 'open'">
                    Ma progression : {{ getMyProgress(challenge).toLocaleString('fr-FR') }} /
                    {{ challenge.targetBooks.toLocaleString('fr-FR') }}
                </p>
                <p v-else-if="challenge.winnerId === currentUserId" class="challenge-won">
                    Défi remporté !
                </p>
                <p v-else class="challenge-lost">
                    Défi remporté par {{ challenge.winnerName }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.game-view {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.game-main {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.challenges-section {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.challenge-card {
    padding: 0.8rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.6rem;
}

.challenge-card p {
    margin: 0.2rem 0;
}

.challenge-won {
    color: #2f855a;
    font-weight: bold;
}

.challenge-lost {
    color: #c53030;
}
</style>
