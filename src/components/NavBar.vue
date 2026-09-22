<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const isAdmin = computed(function () {
    return store.getters['auth/isAdmin']
})

const username = computed(function () {
    return store.getters['auth/username']
})

const stats = computed(function () {
    return store.getters['game/stats']
})

async function handleLogout() {
    await store.dispatch('auth/saveGame')
    await store.dispatch('auth/logout')
    store.dispatch('game/resetGame')
    router.push({ name: 'login' })
}
</script>

<template>
    <header class="navbar">
        <router-link :to="{ name: 'game' }" class="brand">📚 Book Clicker</router-link>

        <nav class="links">
            <router-link :to="{ name: 'game' }">Jeu</router-link>
            <router-link :to="{ name: 'leaderboard' }">Classement</router-link>
            <router-link v-if="isAdmin" :to="{ name: 'admin' }">Administration</router-link>
        </nav>

        <div class="user">
            <span class="counter">{{ stats.books.toLocaleString('fr-FR') }} livres</span>
            <span class="rate">+{{ stats.productionPerSecond }}/s</span>
            <span class="username">
                {{ username }}<span v-if="isAdmin" class="role">admin</span>
            </span>
            <button type="button" @click="handleLogout">Se déconnecter</button>
        </div>
    </header>
</template>

<style scoped>
.navbar {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #1a202c;
    color: white;
}

.brand {
    font-weight: bold;
    color: white;
    text-decoration: none;
}

.links {
    display: flex;
    gap: 1rem;
    flex: 1;
}

.links a {
    color: #cbd5e0;
    text-decoration: none;
}

.links a.router-link-exact-active {
    color: white;
    font-weight: bold;
}

.user {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.role {
    margin-left: 0.4rem;
    padding: 0.1rem 0.4rem;
    background-color: #d69e2e;
    border-radius: 0.3rem;
    font-size: 0.7rem;
}
</style>
