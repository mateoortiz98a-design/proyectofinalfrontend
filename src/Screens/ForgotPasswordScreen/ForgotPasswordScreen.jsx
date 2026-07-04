import BASE_URL from '../../config.js'
import React, { useState } from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import './ForgotPasswordScreen.css'

export const ForgotPasswordScreen = () => {

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    async function onSubmit(formData) {
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
                    <h1 className="forgot-card__logo">💬 MiSlack</h1>
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
                            required
                        />
                    </div>
                    <button type="submit" className="forgot-card__btn">Enviar instrucciones</button>
                </form>

                <p className="forgot-card__footer">
                    <Link to="/login" className="forgot-card__link">← Volver al login</Link>
                </p>
            </div>
        </div>
    )
}