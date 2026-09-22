<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const stats = computed(function () {
    return store.getters['game/stats']
})
</script>

<template>
    <div class="stats-panel">
        <div class="stat">
            <span class="stat-label">Livres</span>
            <span class="stat-value">{{ stats.books.toLocaleString('fr-FR') }}</span>
        </div>
        <div class="stat">
            <span class="stat-label">Total écrit</span>
            <span class="stat-value">{{ stats.totalBooks.toLocaleString('fr-FR') }}</span>
        </div>
        <div class="stat">
            <span class="stat-label">Par clic</span>
            <span class="stat-value">{{ stats.booksPerClick }}</span>
        </div>
        <div class="stat">
            <span class="stat-label">Par seconde</span>
            <span class="stat-value">{{ stats.productionPerSecond }}</span>
        </div>
        <div class="stat">
            <span class="stat-label">Améliorations achetées</span>
            <span class="stat-value">{{ stats.upgradesOwned }}</span>
        </div>
    </div>
</template>

<style scoped>
.stats-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
    background-color: #f7fafc;
    border-radius: 0.75rem;
}

.stat {
    display: flex;
    flex-direction: column;
    min-width: 7rem;
}

.stat-label {
    font-size: 0.8rem;
    color: #718096;
}

.stat-value {
    font-size: 1.3rem;
    font-weight: bold;
    color: #1a202c;
}
</style>
