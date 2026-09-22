import { UPGRADES, COST_GROWTH, getUpgrade } from '../../data/upgrades'

const TICK_MS = 100

export default {
    namespaced: true,

    state: {
        books: 0,
        totalBooks: 0,
        autoProduction: 0,
        clickPower: 1,
        multiplier: 1,
        ownedUpgrades: {},
        intervalId: null,
    },

    mutations: {
        addBooks(state, amount) {
            state.books = state.books + amount
            state.totalBooks = state.totalBooks + amount
        },

        buyUpgrade(state, payload) {
            const upgrade = payload.upgrade
            const cost = payload.cost

            state.books = state.books - cost

            if (state.ownedUpgrades[upgrade.id]) {
                state.ownedUpgrades[upgrade.id] = state.ownedUpgrades[upgrade.id] + 1
            } else {
                state.ownedUpgrades[upgrade.id] = 1
            }

            if (upgrade.type === 'click') {
                state.clickPower = state.clickPower + upgrade.value
            } else if (upgrade.type === 'production') {
                state.autoProduction = state.autoProduction + upgrade.value
            } else if (upgrade.type === 'multiplier') {
                state.multiplier = state.multiplier + upgrade.value
            }
        },

        loadState(state, save) {
            if (!save) {
                save = {}
            }

            if (save.books !== undefined) {
                state.books = save.books
            } else {
                state.books = 0
            }

            if (save.totalBooks !== undefined) {
                state.totalBooks = save.totalBooks
            } else {
                state.totalBooks = state.books
            }

            const ownedUpgrades = {}
            if (save.ownedUpgrades) {
                for (const upgradeId in save.ownedUpgrades) {
                    ownedUpgrades[upgradeId] = save.ownedUpgrades[upgradeId]
                }
            }
            state.ownedUpgrades = ownedUpgrades


            let clickPower = 1
            let autoProduction = 0
            let multiplier = 1

            for (const upgradeId in ownedUpgrades) {
                const upgrade = getUpgrade(upgradeId)
                const ownedCount = ownedUpgrades[upgradeId]

                if (upgrade && ownedCount > 0) {
                    if (upgrade.type === 'click') {
                        clickPower = clickPower + upgrade.value * ownedCount
                    } else if (upgrade.type === 'production') {
                        autoProduction = autoProduction + upgrade.value * ownedCount
                    } else if (upgrade.type === 'multiplier') {
                        multiplier = multiplier + upgrade.value * ownedCount
                    }
                }
            }

            state.clickPower = clickPower
            state.autoProduction = autoProduction
            state.multiplier = multiplier
        },

        resetState(state) {
            state.books = 0
            state.totalBooks = 0
            state.clickPower = 1
            state.autoProduction = 0
            state.multiplier = 1
            state.ownedUpgrades = {}
        },

        setInterval(state, id) {
            state.intervalId = id
        },
    },

    getters: {
        booksPerClick: (state) => {
            return state.clickPower * state.multiplier
        },

        productionPerSecond: (state) => {
            return state.autoProduction * state.multiplier
        },

        isRunning: (state) => {
            return state.intervalId !== null
        },

        ownedCount: (state) => {
            return function (upgradeId) {
                if (state.ownedUpgrades[upgradeId]) {
                    return state.ownedUpgrades[upgradeId]
                }
                return 0
            }
        },

        upgradeCost: (state, getters) => {
            return function (upgradeId) {
                const upgrade = getUpgrade(upgradeId)
                const owned = getters.ownedCount(upgradeId)
                const cost = upgrade.baseCost * Math.pow(COST_GROWTH, owned)
                return Math.ceil(cost)
            }
        },

        isUnlocked: (state, getters) => {
            return function (upgradeId) {
                const upgrade = getUpgrade(upgradeId)
                if (!upgrade.requires) {
                    return true
                }
                return getters.ownedCount(upgrade.requires) > 0
            }
        },

        isMaxed: (state, getters) => {
            return function (upgradeId) {
                const upgrade = getUpgrade(upgradeId)
                if (upgrade.maxOwned === undefined) {
                    return false
                }
                return getters.ownedCount(upgradeId) >= upgrade.maxOwned
            }
        },

        canAfford: (state, getters) => {
            return function (upgradeId) {
                return state.books >= getters.upgradeCost(upgradeId)
            }
        },

        canBuy: (state, getters) => {
            return function (upgradeId) {
                if (!getters.isUnlocked(upgradeId)) {
                    return false
                }
                if (getters.isMaxed(upgradeId)) {
                    return false
                }
                if (!getters.canAfford(upgradeId)) {
                    return false
                }
                return true
            }
        },

        shop: (state, getters) => {
            const shopItems = []

            for (let i = 0; i < UPGRADES.length; i++) {
                const upgrade = UPGRADES[i]
                const shopItem = {
                    id: upgrade.id,
                    name: upgrade.name,
                    description: upgrade.description,
                    baseCost: upgrade.baseCost,
                    type: upgrade.type,
                    value: upgrade.value,
                    requires: upgrade.requires,
                    maxOwned: upgrade.maxOwned,
                    cost: getters.upgradeCost(upgrade.id),
                    owned: getters.ownedCount(upgrade.id),
                    unlocked: getters.isUnlocked(upgrade.id),
                    maxed: getters.isMaxed(upgrade.id),
                    affordable: getters.canAfford(upgrade.id),
                }
                shopItems.push(shopItem)
            }

            return shopItems
        },

        stats: (state, getters) => {
            let upgradesOwned = 0
            for (const upgradeId in state.ownedUpgrades) {
                upgradesOwned = upgradesOwned + state.ownedUpgrades[upgradeId]
            }

            return {
                books: Math.floor(state.books),
                totalBooks: Math.floor(state.totalBooks),
                booksPerClick: getters.booksPerClick,
                productionPerSecond: Number(getters.productionPerSecond.toFixed(1)),
                multiplier: state.multiplier,
                upgradesOwned: upgradesOwned,
            }
        },

        saveData: (state) => {
            const ownedUpgradesCopy = {}
            for (const upgradeId in state.ownedUpgrades) {
                ownedUpgradesCopy[upgradeId] = state.ownedUpgrades[upgradeId]
            }

            return {
                books: state.books,
                totalBooks: state.totalBooks,
                ownedUpgrades: ownedUpgradesCopy,
            }
        },
    },

    actions: {
        click(context) {
            context.commit('addBooks', context.getters.booksPerClick)
        },

        startAutoProduction(context) {
            if (context.state.intervalId !== null) {
                return
            }

            const intervalId = setInterval(function () {
                const amount = (context.getters.productionPerSecond * TICK_MS) / 1000
                if (amount > 0) {
                    context.commit('addBooks', amount)
                }
            }, TICK_MS)

            context.commit('setInterval', intervalId)
        },

        stopAutoProduction(context) {
            if (context.state.intervalId === null) {
                return
            }

            clearInterval(context.state.intervalId)
            context.commit('setInterval', null)
        },

        purchase(context, upgradeId) {
            const upgrade = getUpgrade(upgradeId)

            if (!upgrade) {
                return false
            }
            if (!context.getters.canBuy(upgradeId)) {
                return false
            }

            const cost = context.getters.upgradeCost(upgradeId)
            context.commit('buyUpgrade', { upgrade: upgrade, cost: cost })
            return true
        },

        loadGame(context, save) {
            context.commit('loadState', save)
        },

        resetGame(context) {
            context.commit('resetState')
        },
    },
}