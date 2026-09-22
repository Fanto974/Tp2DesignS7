const BASE_URL = 'http://localhost:3000'

export async function httpGet(path) {
    const response = await fetch(BASE_URL + path)

    if (!response.ok) {
        throw new Error('Erreur pendant la requête GET sur ' + path)
    }

    const data = await response.json()
    return data
}

export async function httpPost(path, body) {
    const response = await fetch(BASE_URL + path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        throw new Error('Erreur pendant la requête POST sur ' + path)
    }

    const data = await response.json()
    return data
}

export async function httpPatch(path, body) {
    const response = await fetch(BASE_URL + path, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        throw new Error('Erreur pendant la requête PATCH sur ' + path)
    }

    const data = await response.json()
    return data
}