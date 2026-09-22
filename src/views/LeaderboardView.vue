<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import LeaderboardTable from '../components/LeaderboardTable.vue'
import ChallengeModal from '../components/ChallengeModal.vue'

const store = useStore()

const sortedPlayers = computed(function () {
    return store.getters['leaderboard/sortedPlayers']
})

const selectedOpponent = ref<any>(null)

function handleChallenge(player: any) {
    selectedOpponent.value = player
}

function handleCancel() {
    selectedOpponent.value = null
}

async function handleConfirm(targetBooks: number) {
    const opponent = selectedOpponent.value

    if (opponent === null) {
        return
    }

    await store.dispatch('challenge/sendChallenge', {
        opponentId: opponent.id,
        opponentName: opponent.username,
        opponentTotalBooks: opponent.totalBooks,
        targetBooks: targetBooks,
    })

    selectedOpponent.value = null
}

onMounted(function () {
    store.dispatch('leaderboard/fetchPlayers')
})
</script>

<template>
    <div class="leaderboard-view">
        <h1>Classement</h1>

        <LeaderboardTable :players="sortedPlayers" @challenge="handleChallenge" />

        <ChallengeModal
            v-if="selectedOpponent !== null"
            :opponent="selectedOpponent"
            @confirm="handleConfirm"
            @cancel="handleCancel"
        />
    </div>
</template>

<style scoped>
.leaderboard-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
