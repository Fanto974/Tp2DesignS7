<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const multiplier = computed(function () {
    return store.getters['game/stats'].multiplier
})
</script>

<template>
    <div class="multiplier-card">
        <span class="multiplier-label">Multiplicateur global</span>
        <span class="multiplier-value">x{{ multiplier }}</span>
    </div>
</template>

<style scoped>
.multiplier-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem 1.5rem;
    background-color: #faf089;
    border-radius: 0.75rem;
    min-width: 8rem;
}

.multiplier-label {
    font-size: 0.85rem;
    color: #744210;
}

.multiplier-value {
    font-size: 1.8rem;
    font-weight: bold;
    color: #744210;
}
</style>
