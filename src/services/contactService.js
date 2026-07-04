import BASE_URL_ROOT from '../config.js'
const BASE_URL = `${BASE_URL_ROOT}/api`

function getToken() { return localStorage.getItem('access_token') }

export async function getContacts() {
    const response = await fetch(`${BASE_URL}/contact`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return await response.json()
}

export async function getPendingRequests() {
    const response = await fetch(`${BASE_URL}/contact/pending`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return await response.json()
}

export async function sendContactRequest(email) {
    const response = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ email })
    })
    return await response.json()
}

export async function respondRequest(contact_id, decision) {
    const response = await fetch(`${BASE_URL}/contact/${contact_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ decision })
    })
    return await response.json()
}

export async function deleteContact(contact_id) {
    const response = await fetch(`${BASE_URL}/contact/${contact_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return await response.json()
}
