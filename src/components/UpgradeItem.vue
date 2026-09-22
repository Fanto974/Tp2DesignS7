<script setup lang="ts">
const props = defineProps({
    upgrade: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['buy'])

function handleBuyClick() {
    emit('buy', props.upgrade.id)
}
</script>

<template>
    <div class="upgrade-item" :class="{ locked: !upgrade.unlocked, maxed: upgrade.maxed }">
        <div class="upgrade-header">
            <span class="upgrade-name">{{ upgrade.name }}</span>
            <span class="upgrade-owned">x{{ upgrade.owned }}</span>
        </div>

        <p class="upgrade-description">{{ upgrade.description }}</p>

        <p v-if="!upgrade.unlocked" class="upgrade-locked-message">
            Amélioration précédente requise
        </p>
        <p v-else-if="upgrade.maxed" class="upgrade-locked-message">
            Amélioration déjà au maximum
        </p>
        <button
            v-else
            type="button"
            class="upgrade-buy-button"
            :disabled="!upgrade.affordable"
            @click="handleBuyClick"
        >
            Acheter pour {{ upgrade.cost.toLocaleString('fr-FR') }} livres
        </button>
    </div>
</template>

<style scoped>
.upgrade-item {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.9rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.6rem;
    background-color: white;
    color: #1a202c;
}

.upgrade-item.locked {
    opacity: 0.55;
}

.upgrade-item.maxed {
    background-color: #f0fff4;
}

.upgrade-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
}

.upgrade-description {
    font-size: 0.85rem;
    color: #4a5568;
    margin: 0;
}

.upgrade-locked-message {
    font-size: 0.8rem;
    color: #a0aec0;
    margin: 0;
}

.upgrade-buy-button {
    align-self: flex-start;
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 0.4rem;
    background-color: #3182ce;
    color: white;
    cursor: pointer;
}

.upgrade-buy-button:disabled {
    background-color: #cbd5e0;
    cursor: not-allowed;
}
</style>
