import BASE_URL from '../../config.js'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { logout } from '../../services/authService'
import './ProfileScreen.css'

function getUserFromToken() {
    const token = localStorage.getItem('access_token')
    if (!token) return null
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
}

export const ProfileScreen = () => {
    const navigate = useNavigate()
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const currentUser = getUserFromToken()

    function handleLogout() {
        logout()
        navigate('/login')
    }

    async function handleDeleteAccount() {
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/user/${currentUser.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            const data = await response.json()
            if (data.ok) {
                logout()
                navigate('/login')
            } else {
                setError(data.message)
            }
        } catch {
            setError('Error al eliminar la cuenta')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="profile-screen">
            <div className="profile-card">
                <div className="profile-card__header">
                    <div className="profile-card__avatar">
                        {currentUser?.name?.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="profile-card__name">{currentUser?.name}</h2>
                    <p className="profile-card__email">{currentUser?.email}</p>
                </div>

                {error && <div className="profile-card__error">{error}</div>}

                <div className="profile-card__actions">
                    <button className="profile-card__btn profile-card__btn--back" onClick={() => navigate('/home')}>
                        ← Volver al inicio
                    </button>

                    <button className="profile-card__btn profile-card__btn--logout" onClick={handleLogout}>
                        Cerrar sesión
                    </button>

                    {!confirmDelete ? (
                        <button className="profile-card__btn profile-card__btn--delete" onClick={() => setConfirmDelete(true)}>
                            🗑️ Eliminar cuenta
                        </button>
                    ) : (
                        <div className="profile-card__confirm">
                            <p className="profile-card__confirm-text">
                                ¿Estás seguro? Esta acción es <strong>irreversible</strong>. Se eliminarán tus datos, contactos y membresías.
                            </p>
                            <div className="profile-card__confirm-actions">
                                <button
                                    className="profile-card__btn profile-card__btn--delete"
                                    onClick={handleDeleteAccount}
                                    disabled={loading}
                                >
                                    {loading ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
                                </button>
                                <button
                                    className="profile-card__btn profile-card__btn--cancel"
                                    onClick={() => setConfirmDelete(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}