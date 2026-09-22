<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

const store = useStore()
const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleSubmit() {
    errorMessage.value = ''
    isLoading.value = true

    const success = await store.dispatch('auth/login', {
        username: username.value,
        password: password.value,
    })

    isLoading.value = false

    if (!success) {
        errorMessage.value = "Nom d'utilisateur ou mot de passe incorrect"
        return
    }

    const redirectPath = route.query.redirect

    if (typeof redirectPath === 'string') {
        router.push(redirectPath)
    } else {
        router.push({ name: 'game' })
    }
}
</script>

<template>
    <div class="login-view">
        <form class="login-form" @submit.prevent="handleSubmit">
            <h1>📚 Book Clicker</h1>

            <label>
                Nom d'utilisateur
                <input v-model="username" type="text" required />
            </label>

            <label>
                Mot de passe
                <input v-model="password" type="password" required />
            </label>

            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

            <button type="submit" :disabled="isLoading">
                <span v-if="isLoading">Connexion...</span>
                <span v-else>Se connecter</span>
            </button>

            <p class="hint">
                Comptes de test : admin / admin (administrateur) ou mathis / 1234 (joueur)
            </p>
        </form>
    </div>
</template>

<style scoped>
.login-view {
    display: flex;
    justify-content: center;
    padding-top: 4rem;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    width: 20rem;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
}

.login-form h1 {
    text-align: center;
    margin: 0 0 0.5rem 0;
}

.login-form label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.9rem;
}

.login-form input {
    padding: 0.5rem;
    border: 1px solid #cbd5e0;
    border-radius: 0.4rem;
}

.login-form button {
    padding: 0.6rem;
    border: none;
    border-radius: 0.4rem;
    background-color: #2f855a;
    color: white;
    cursor: pointer;
}

.error-message {
    color: #c53030;
    font-size: 0.85rem;
    margin: 0;
}

.hint {
    font-size: 0.75rem;
    color: #a0aec0;
    margin: 0;
    text-align: center;
}
</style>
