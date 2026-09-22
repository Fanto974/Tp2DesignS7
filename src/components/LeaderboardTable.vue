<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
    players: {
        type: Array as PropType<any[]>,
        required: true,
    },
})

const emit = defineEmits(['challenge'])

const store = useStore()

const currentUserId = computed(function () {
    return store.getters['auth/userId']
})

function handleChallengeClick(player: any) {
    emit('challenge', player)
}
</script>

<template>
    <table class="leaderboard-table">
        <thead>
            <tr>
                <th>Rang</th>
                <th>Joueur</th>
                <th>Total de livres</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(player, index) in props.players" :key="player.id">
                <td>{{ index + 1 }}</td>
                <td>
                    <router-link :to="{ name: 'player', params: { id: player.id } }">
                        {{ player.username }}
                    </router-link>
                </td>
                <td>{{ player.totalBooks.toLocaleString('fr-FR') }}</td>
                <td>
                    <button
                        v-if="player.id !== currentUserId"
                        type="button"
                        class="challenge-button"
                        @click="handleChallengeClick(player)"
                    >
                        Défier
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
.leaderboard-table {
    width: 100%;
    border-collapse: collapse;
}

.leaderboard-table th,
.leaderboard-table td {
    text-align: left;
    padding: 0.6rem 0.8rem;
    border-bottom: 1px solid #e2e8f0;
}

.leaderboard-table a {
    color: #2b6cb0;
    text-decoration: none;
}

.challenge-button {
    padding: 0.3rem 0.7rem;
    border: none;
    border-radius: 0.4rem;
    background-color: #dd6b20;
    color: white;
    cursor: pointer;
}
</style>
