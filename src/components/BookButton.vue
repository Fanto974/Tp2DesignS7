<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const booksPerClick = computed(function () {
    return store.getters['game/booksPerClick']
})

function handleClick() {
    store.dispatch('game/click')
}
</script>

<template>
    <button type="button" class="book-button" @click="handleClick">
        <span class="icon">📖</span>
        <span class="label">Écrire un livre</span>
        <span class="power">+{{ booksPerClick }} livre(s) par clic</span>
    </button>
</template>

<style scoped>
.book-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem 2rem;
    border: none;
    border-radius: 1rem;
    background-color: #2f855a;
    color: white;
    cursor: pointer;
    font-size: 1.1rem;
}

.book-button:active {
    transform: scale(0.97);
}

.icon {
    font-size: 2.5rem;
}

.power {
    font-size: 0.9rem;
    opacity: 0.85;
}
</style>
