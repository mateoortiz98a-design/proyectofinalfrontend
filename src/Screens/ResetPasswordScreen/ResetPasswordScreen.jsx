import BASE_URL from '../../config.js'
import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import useForm from '../../hooks/useForm'
import '../../styles/auth.css'
import './ResetPasswordScreen.css'

export const ResetPasswordScreen = () => {

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    async function onSubmit(formData) {
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }
        if (formData.newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword: formData.newPassword })
            })
            const data = await response.json()
            if (data.ok) {
                navigate('/login')
            } else {
                setError(data.message)
            }
        } catch {
            setError('Error al conectar con el servidor')
        } finally {
            setLoading(false)
        }
    }

    const { formState, handleChange, handleSubmit } = useForm(
        { newPassword: '', confirmPassword: '' },
        onSubmit
    )

    if (!token) {
        return (
            <div className="reset-screen">
                <div className="reset-card">
                    <div className="reset-card__icon">❌</div>
                    <h2 className="reset-card__title">Link inválido</h2>
                    <p className="reset-card__subtitle">Este link no es válido o expiró.</p>
                    <Link to="/forgot-password" className="reset-card__btn">Solicitar nuevo link</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="reset-screen">
            <div className="reset-card">
                <div className="reset-card__header">
                    <div className="auth-logo" style={{ justifyContent: 'center', width: '100%' }}>
                        <span className="auth-logo__badge">M</span>
                        <span className="auth-logo__text">MiSlack</span>
                    </div>
                    <h2 className="reset-card__title">Nueva contraseña</h2>
                    <p className="reset-card__subtitle">Ingresá tu nueva contraseña</p>
                </div>

                {error && <div className="reset-card__error">{error}</div>}

                <form onSubmit={handleSubmit} className="reset-card__form">
                    <div className="reset-card__field">
                        <label htmlFor="newPassword" className="reset-card__label">Nueva contraseña</label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            className="reset-card__input"
                            placeholder="Mínimo 6 caracteres"
                            value={formState.newPassword}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="reset-card__field">
                        <label htmlFor="confirmPassword" className="reset-card__label">Confirmar contraseña</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className="reset-card__input"
                            placeholder="Repetí tu contraseña"
                            value={formState.confirmPassword}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>
                    <button type="submit" className="reset-card__btn" disabled={loading}>
                        {loading ? (<><span className="auth-spinner auth-spinner--btn" /> Guardando...</>) : 'Cambiar contraseña'}
                    </button>
                </form>
            </div>

            {loading && (
                <div className="auth-loading-overlay">
                    <div className="auth-loading-box">
                        <span className="auth-spinner" />
                        <p>Guardando tu nueva contraseña...</p>
                    </div>
                </div>
            )}
        </div>
    )
}