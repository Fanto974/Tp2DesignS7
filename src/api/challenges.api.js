import { httpGet, httpPost, httpPatch } from './http'

export async function getAllChallenges() {
    const challenges = await httpGet('/challenges')
    return challenges
}

export async function createChallenge(challenge) {
    const newChallenge = {
        challengerId: challenge.challengerId,
        challengerName: challenge.challengerName,
        challengerStart: challenge.challengerStart,
        opponentId: challenge.opponentId,
        opponentName: challenge.opponentName,
        opponentStart: challenge.opponentStart,
        targetBooks: challenge.targetBooks,
        status: 'open',
        winnerId: null,
        winnerName: null,
        createdAt: new Date().toISOString(),
    }

    const createdChallenge = await httpPost('/challenges', newChallenge)
    return createdChallenge
}

export async function finishChallenge(challengeId, winnerId, winnerName) {
    const updatedChallenge = await httpPatch('/challenges/' + challengeId, {
        status: 'completed',
        winnerId: winnerId,
        winnerName: winnerName,
    })
    return updatedChallenge
}