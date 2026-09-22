<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { getUserById } from '../api/users.api'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
})

const store = useStore()

const player = ref<any>(null)
const isLoading = ref(true)

const rank = computed(function () {
    const sortedPlayers = store.getters['leaderboard/sortedPlayers']

    for (let i = 0; i < sortedPlayers.length; i++) {
        if (sortedPlayers[i].id === props.id) {
            return i + 1
        }
    }

    return null
})

const playerChallenges = computed(function () {
    const allChallenges = store.state.challenge.challenges
    const filtered = []

    for (let i = 0; i < allChallenges.length; i++) {
        const challenge = allChallenges[i]
        if (challenge.challengerId === props.id || challenge.opponentId === props.id) {
            filtered.push(challenge)
        }
    }

    return filtered
})

onMounted(async function () {
    isLoading.value = true
    player.value = await getUserById(props.id)
    await store.dispatch('leaderboard/fetchPlayers')
    await store.dispatch('challenge/fetchChallenges')
    isLoading.value = false
})
</script>

<template>
    <div class="player-profile-view">
        <p v-if="isLoading">Chargement...</p>

        <div v-else-if="player !== null" class="profile-card">
            <h1>{{ player.username }}</h1>
            <p v-if="rank !== null">Classé #{{ rank }}</p>
            <p>Total de livres : {{ player.totalBooks.toLocaleString('fr-FR') }}</p>

            <h2>Défis</h2>
            <p v-if="playerChallenges.length === 0">Aucun défi pour le moment</p>
            <ul v-else>
                <li v-for="challenge in playerChallenges" :key="challenge.id">
                    {{ challenge.challengerName }} contre {{ challenge.opponentName }} —
                    objectif {{ challenge.targetBooks.toLocaleString('fr-FR') }} livres —
                    <span v-if="challenge.status === 'open'">en cours</span>
                    <span v-else>gagné par {{ challenge.winnerName }}</span>
                </li>
            </ul>
        </div>

        <p v-else>Joueur introuvable</p>
    </div>
</template>

<style scoped>
.profile-card {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.profile-card ul {
    padding-left: 1.2rem;
}
</style>
