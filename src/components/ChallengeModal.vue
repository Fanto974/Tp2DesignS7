<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
    opponent: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['confirm', 'cancel'])

const targetBooks = ref(1000)

function handleConfirmClick() {
    emit('confirm', targetBooks.value)
}

function handleCancelClick() {
    emit('cancel')
}
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-box">
            <h2>Défier {{ props.opponent.username }}</h2>
            <p>
                Le premier des deux joueurs qui produit ce nombre de livres
                supplémentaires à partir de maintenant remporte le défi.
            </p>

            <label class="target-label">
                Objectif (livres à produire)
                <input v-model.number="targetBooks" type="number" min="1" />
            </label>

            <div class="modal-actions">
                <button type="button" @click="handleCancelClick">Annuler</button>
                <button type="button" class="confirm-button" @click="handleConfirmClick">
                    Lancer le défi
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-box {
    background-color: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    width: 22rem;
    max-width: 90vw;
    color: #1a202c;
}

.target-label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin: 1rem 0;
    font-size: 0.9rem;
}

.target-label input {
    padding: 0.4rem;
    border: 1px solid #cbd5e0;
    border-radius: 0.4rem;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.6rem;
}

.confirm-button {
    padding: 0.4rem 0.9rem;
    border: none;
    border-radius: 0.4rem;
    background-color: #dd6b20;
    color: white;
    cursor: pointer;
}
</style>
