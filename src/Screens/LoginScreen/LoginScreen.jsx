import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'
import '../../styles/auth.css'
import './LoginScreen.css'

export const LoginScreen = () => {

    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    async function onSubmit(formData) {
        setError(null)
        setLoading(true)
        try {
            const response = await login(formData.email, formData.password)
            if (response.ok) {
                localStorage.setItem('access_token', response.data.access_token)
                localStorage.setItem('user_email', formData.email)
                navigate('/home')
            } else {
                setError(response.message)
                setLoading(false)
            }
        } catch {
            setError('Error al conectar con el servidor')
            setLoading(false)
        }
    }

    const { formState, handleChange, handleSubmit } = useForm(
        { email: '', password: '' },
        onSubmit
    )

    return (
        <div className="login-screen">
            <div className="login-card">
                <div className="login-card__header">
                    <div className="auth-logo">
                        <span className="auth-logo__badge">M</span>
                        <span className="auth-logo__text">MiSlack</span>
                    </div>
                    <h2 className="login-card__title">Iniciar sesión</h2>
                    <p className="login-card__subtitle">Bienvenido de vuelta</p>
                </div>

                {error && <div className="login-card__error">{error}</div>}

                <form onSubmit={handleSubmit} className="login-card__form">
                    <div className="login-card__field">
                        <label htmlFor="email" className="login-card__label">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="login-card__input"
                            placeholder="tu@email.com"
                            value={formState.email}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="login-card__field">
                        <label htmlFor="password" className="login-card__label">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="login-card__input"
                            placeholder="Tu contraseña"
                            value={formState.password}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    <button type="submit" className="login-card__btn" disabled={loading}>
                        {loading ? (<><span className="auth-spinner auth-spinner--btn" /> Iniciando sesión...</>) : 'Iniciar sesión'}
                    </button>
                </form>

                <p className="login-card__footer">
                    ¿No tenés cuenta? <Link to="/register" className="login-card__link">Registrate</Link>
                </p>
                <p className="login-card__footer" style={{ marginTop: '8px' }}>
                    <Link to="/forgot-password" className="login-card__link">¿Olvidaste tu contraseña?</Link>
                </p>
            </div>

            {loading && (
                <div className="auth-loading-overlay">
                    <div className="auth-loading-box">
                        <span className="auth-spinner" />
                        <p>Iniciando sesión...</p>
                    </div>
                </div>
            )}
        </div>
    )
}