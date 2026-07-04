import BASE_URL_ROOT from '../config.js'
const BASE_URL = `${BASE_URL_ROOT}/api`

function getToken() { return localStorage.getItem('access_token') }

export async function inviteUser(workspace_id, email, rol) {
    const response = await fetch(`${BASE_URL}/workspace/${workspace_id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ invited_email: email, role: rol })
    })
    return await response.json()
}

export async function getMembers(workspace_id) {
    const response = await fetch(`${BASE_URL}/workspace/${workspace_id}/members`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return await response.json()
}

export async function removeMember(workspace_id, member_id) {
    const response = await fetch(`${BASE_URL}/workspace/${workspace_id}/members/${member_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return await response.json()
}

export async function updateMemberRole(workspace_id, member_id, role) {
    const response = await fetch(`${BASE_URL}/workspace/${workspace_id}/members/${member_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ role })
    })
    return await response.json()
}
