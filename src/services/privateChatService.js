const BASE_URL = 'http://localhost:8080/api'

function getToken() {
    return localStorage.getItem('access_token')
}

export async function getMyPrivateChats() {
    const response = await fetch(`${BASE_URL}/private-chat`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return await response.json()
}

export async function createPrivateChat(user_id) {
    const response = await fetch(`${BASE_URL}/private-chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ user_id })
    })
    return await response.json()
}

export async function deletePrivateChat(chat_id) {
    const response = await fetch(`${BASE_URL}/private-chat/${chat_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return await response.json()
}

export async function getPrivateMessages(chat_id) {
    const response = await fetch(`${BASE_URL}/private-message/chat/${chat_id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return await response.json()
}

export async function sendPrivateMessage(chat_id, mensaje) {
    const response = await fetch(`${BASE_URL}/private-message/chat/${chat_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ mensaje })
    })
    return await response.json()
}

export async function deletePrivateMessage(message_id) {
    const response = await fetch(`${BASE_URL}/private-message/${message_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return await response.json()
}

export async function updatePrivateMessage(message_id, mensaje) {
    const response = await fetch(`${BASE_URL}/private-message/${message_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ mensaje })
    })
    return await response.json()
}