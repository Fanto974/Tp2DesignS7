<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const users = computed(function () {
    return store.state.admin.users
})

const editedScores = reactive<Record<string, number>>({})

function initializeEditedScores() {
    const userList = store.state.admin.users
    for (let i = 0; i < userList.length; i++) {
        const user = userList[i]
        editedScores[user.id] = user.totalBooks
    }
}

async function handleSave(userId: string) {
    const newTotalBooks = editedScores[userId]
    await store.dispatch('admin/setPlayerScore', { userId: userId, newTotalBooks: newTotalBooks })
    initializeEditedScores()
}

async function handleReset(userId: string) {
    await store.dispatch('admin/resetPlayer', userId)
    initializeEditedScores()
}

onMounted(async function () {
    await store.dispatch('admin/fetchUsers')
    initializeEditedScores()
})
</script>

<template>
    <div class="admin-view">
        <h1>Administration</h1>

        <table class="admin-table">
            <thead>
                <tr>
                    <th>Joueur</th>
                    <th>Rôle</th>
                    <th>Score</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.username }}</td>
                    <td>{{ user.role }}</td>
                    <td>
                        <input v-model.number="editedScores[user.id]" type="number" min="0" />
                    </td>
                    <td class="admin-actions">
                        <button type="button" @click="handleSave(user.id)">Enregistrer</button>
                        <button type="button" class="reset-button" @click="handleReset(user.id)">
                            Réinitialiser
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.admin-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
}

.admin-table th,
.admin-table td {
    text-align: left;
    padding: 0.6rem 0.8rem;
    border-bottom: 1px solid #e2e8f0;
}

.admin-table input {
    width: 6rem;
    padding: 0.3rem;
    border: 1px solid #cbd5e0;
    border-radius: 0.4rem;
}

.admin-actions {
    display: flex;
    gap: 0.5rem;
}

.admin-actions button {
    padding: 0.3rem 0.7rem;
    border: none;
    border-radius: 0.4rem;
    cursor: pointer;
    background-color: #3182ce;
    color: white;
}

.reset-button {
    background-color: #c53030 !important;
}
</style>
