import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
        meta: { guestOnly: true },
    },
    {
        path: '/',
        name: 'game',
        component: () => import('../views/GameView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/leaderboard',
        name: 'leaderboard',
        component: () => import('../views/LeaderboardView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/player/:id',
        name: 'player',
        component: () => import('../views/PlayerProfileView.vue'),
        props: true,
        meta: { requiresAuth: true },
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/AdminView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to) => {
    const isAuthenticated = store.getters['auth/isAuthenticated']
    const isAdmin = store.getters['auth/isAdmin']

    if (to.meta.requiresAuth && !isAuthenticated) {
        return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (to.meta.requiresAdmin && !isAdmin) {
        return { name: 'game' }
    }
    if (to.meta.guestOnly && isAuthenticated) {
        return { name: 'game' }
    }
})

export default router