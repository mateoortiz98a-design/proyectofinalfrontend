import BASE_URL from '../../config.js'
import React, { useState } from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import '../../styles/auth.css'
import './ForgotPasswordScreen.css'

export const ForgotPasswordScreen = () => {

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    async function onSubmit(formData) {
        setError(null)
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/auth/reset-password-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            })
            const data = await response.json()
            if (data.ok) {
                setSuccess(true)
                setError(null)
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
        { email: '' },
        onSubmit
    )

    if (success) {
        return (
            <div className="forgot-screen">
                <div className="forgot-card">
                    <div className="forgot-card__icon">📧</div>
                    <h2 className="forgot-card__title">Revisá tu email</h2>
                    <p className="forgot-card__subtitle">
                        Si existe una cuenta con ese email te enviamos las instrucciones para restablecer tu contraseña.
                    </p>
                    <Link to="/login" className="forgot-card__btn">Volver al login</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="forgot-screen">
            <div className="forgot-card">
                <div className="forgot-card__header">
                    <div className="auth-logo" style={{ justifyContent: 'center', width: '100%' }}>
                        <span className="auth-logo__badge">M</span>
                        <span className="auth-logo__text">MiSlack</span>
                    </div>
                    <h2 className="forgot-card__title">Recuperar contraseña</h2>
                    <p className="forgot-card__subtitle">Ingresá tu email y te enviamos un link para restablecer tu contraseña</p>
                </div>

                {error && <div className="forgot-card__error">{error}</div>}

                <form onSubmit={handleSubmit} className="forgot-card__form">
                    <div className="forgot-card__field">
                        <label htmlFor="email" className="forgot-card__label">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="forgot-card__input"
                            placeholder="tu@email.com"
                            value={formState.email}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>
                    <button type="submit" className="forgot-card__btn" disabled={loading}>
                        {loading ? (<><span className="auth-spinner auth-spinner--btn" /> Enviando...</>) : 'Enviar instrucciones'}
                    </button>
                </form>

                <p className="forgot-card__footer">
                    <Link to="/login" className="forgot-card__link">← Volver al login</Link>
                </p>
            </div>

            {loading && (
                <div className="auth-loading-overlay">
                    <div className="auth-loading-box">
                        <span className="auth-spinner" />
                        <p>Enviando instrucciones...</p>
                    </div>
                </div>
            )}
        </div>
    )
}