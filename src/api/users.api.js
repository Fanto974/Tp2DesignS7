import { httpGet, httpPatch } from './http'

export async function findUserByCredentials(username, password) {
    const path = '/users?username=' + encodeURIComponent(username)
    const users = await httpGet(path)

    for (let i = 0; i < users.length; i++) {
        if (String(users[i].password) === String(password)) {
            return users[i]
        }
    }

    return null
}

export async function getAllUsers() {
    const users = await httpGet('/users')
    return users
}

export async function getUserById(userId) {
    const user = await httpGet('/users/' + userId)
    return user
}

export async function updateUserTotalBooks(userId, totalBooks) {
    const updatedUser = await httpPatch('/users/' + userId, { totalBooks: totalBooks })
    return updatedUser
}