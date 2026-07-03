import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'
import './LoginScreen.css'

export const LoginScreen = () => {

    const navigate = useNavigate()
    const [error, setError] = useState(null)

    async function onSubmit(formData) {
        try {
            const response = await login(formData.email, formData.password)
            if (response.ok) {
                localStorage.setItem('access_token', response.data.access_token)
                localStorage.setItem('user_email', formData.email)
                navigate('/home')
            } else {
                setError(response.message)
            }
        } catch {
            setError('Error al conectar con el servidor')
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
                    <h1 className="login-card__logo">💬 MiSlack</h1>
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
                            required
                        />
                    </div>

                    <button type="submit" className="login-card__btn">Iniciar sesión</button>
                </form>

                <p className="login-card__footer">
                    ¿No tenés cuenta? <Link to="/register" className="login-card__link">Registrate</Link>
                </p>
                <p className="login-card__footer" style={{ marginTop: '8px' }}>
                    <Link to="/forgot-password" className="login-card__link">¿Olvidaste tu contraseña?</Link>
                </p>
            </div>
        </div>
    )
}