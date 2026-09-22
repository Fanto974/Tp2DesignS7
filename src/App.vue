<script setup lang="ts">
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import NavBar from './components/NavBar.vue'

const store = useStore()

const isAuthenticated = computed(function () {
    return store.getters['auth/isAuthenticated']
})

watch(
    isAuthenticated,
    function (loggedIn) {
        if (loggedIn) {
            store.dispatch('game/startAutoProduction')
        } else {
            store.dispatch('game/stopAutoProduction')
        }
    },
    { immediate: true }
)
</script>

<template>
    <div class="app">
        <NavBar v-if="isAuthenticated" />

        <main class="content">
            <router-view />
        </main>
    </div>
</template>

<style scoped>
.app {
    width: 100%;
    min-height: 100vh;
}

.content {
    width: 100%;
    padding: 1.5rem 2.5rem;
}
</style>
