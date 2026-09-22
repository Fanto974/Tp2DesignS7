import { httpGet, httpPost, httpPatch } from './http'

export async function getSaveByUserId(userId) {
    const saves = await httpGet('/saves')

    for (let i = 0; i < saves.length; i++) {
        if (String(saves[i].userId) === String(userId)) {
            return saves[i]
        }
    }

    return null
}

export async function createSave(userId, saveData) {
    const newSave = {
        userId: userId,
        books: saveData.books,
        totalBooks: saveData.totalBooks,
        ownedUpgrades: saveData.ownedUpgrades,
    }

    const createdSave = await httpPost('/saves', newSave)
    return createdSave
}

export async function updateSave(saveId, saveData) {
    const updatedSave = await httpPatch('/saves/' + saveId, {
        books: saveData.books,
        totalBooks: saveData.totalBooks,
        ownedUpgrades: saveData.ownedUpgrades,
    })
    return updatedSave
}