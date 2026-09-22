const AUTOSAVE_MS = 30000

export default function autosave(store) {
    let timerId = null

    store.watch(
        function (state, getters) {
            return getters['auth/isAuthenticated']
        },
        function (isLoggedIn) {
            if (timerId !== null) {
                clearInterval(timerId)
                timerId = null
            }

            if (isLoggedIn) {
                timerId = setInterval(function () {
                    store.dispatch('auth/saveGame')
                }, AUTOSAVE_MS)
            }
        },
        { immediate: true }
    )
}
