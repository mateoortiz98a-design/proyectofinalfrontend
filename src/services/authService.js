import BASE_URL from '../config.js'

export async function login(email, password) {
    try {
        const response_http = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        return await response_http.json()
    } catch (error) {
        throw new Error("Error al hacer el login")
    }
}

export function logout() {
    localStorage.removeItem('access_token')
}

