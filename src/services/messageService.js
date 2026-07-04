import BASE_URL_ROOT from '../config.js'
const BASE_URL = `${BASE_URL_ROOT}/api`

function getToken() { return localStorage.getItem('access_token') }

export async function getMessages(chat_id) {
    const response = await fetch(`${BASE_URL}/message/chat/${chat_id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return await response.json()
}

export async function sendMessage(chat_id, mensaje) {
    const response = await fetch(`${BASE_URL}/message/chat/${chat_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ mensaje })
    })
    return await response.json()
}

export async function deleteMessage(message_id) {
    const response = await fetch(`${BASE_URL}/message/${message_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return await response.json()
}

export async function updateMessage(message_id, mensaje) {
    const response = await fetch(`${BASE_URL}/message/${message_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ mensaje })
    })
    return await response.json()
}
