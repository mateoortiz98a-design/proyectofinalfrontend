import BASE_URL_ROOT from '../config.js'
const BASE_URL = `${BASE_URL_ROOT}/api`

function getToken() { return localStorage.getItem('access_token') }

export async function getAllUsers() {
    const response = await fetch(`${BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return await response.json()
}
