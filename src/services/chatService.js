const BASE_URL = 'http://localhost:8080/api'

function getToken() {
    return localStorage.getItem('access_token')
}

export async function getChatsByWorkspace(workspace_id) {
    const response = await fetch(`${BASE_URL}/group-chat/workspace/${workspace_id}`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })
    return await response.json()
}

export async function createChat(workspace_id, nombre) {
    const response = await fetch(`${BASE_URL}/group-chat/workspace/${workspace_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ nombre })
    })
    return await response.json()
}

export async function deleteChat(chat_id) {
    const response = await fetch(`${BASE_URL}/group-chat/${chat_id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })
    return await response.json()
}