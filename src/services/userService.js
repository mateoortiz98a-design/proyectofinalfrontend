const BASE_URL = 'http://localhost:8080/api'

function getToken() {
    return localStorage.getItem('access_token')
}

export async function getAllUsers() {
    const response = await fetch(`${BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return await response.json()
}