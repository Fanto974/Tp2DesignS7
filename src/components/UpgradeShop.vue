<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import UpgradeItem from './UpgradeItem.vue'

const store = useStore()

const shopItems = computed(function () {
    return store.getters['game/shop']
})

function handleBuy(upgradeId: string) {
    store.dispatch('game/purchase', upgradeId)
}
</script>

<template>
    <div class="upgrade-shop">
        <h2>Boutique</h2>
        <div class="upgrade-list">
            <UpgradeItem
                v-for="upgrade in shopItems"
                :key="upgrade.id"
                :upgrade="upgrade"
                @buy="handleBuy"
            />
        </div>
    </div>
</template>

<style scoped>
.upgrade-shop {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.upgrade-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 0.6rem;
}
</style>
