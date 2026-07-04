import BASE_URL_ROOT from '../config.js'
const BASE_URL = `${BASE_URL_ROOT}/api`

function getToken() { return localStorage.getItem('access_token') }

export async function getWorkspaces() {
    const response = await fetch(`${BASE_URL}/workspace`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return await response.json()
}

export async function createWorkspace(nombre, descripcion = '') {
    const response = await fetch(`${BASE_URL}/workspace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ nombre, descripcion })
    })
    return await response.json()
}

export async function deleteWorkspace(workspace_id) {
    const response = await fetch(`${BASE_URL}/workspace/${workspace_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return await response.json()
}

export async function updateWorkspace(workspace_id, nombre) {
    const response = await fetch(`${BASE_URL}/workspace/${workspace_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ nombre })
    })
    return await response.json()
}
