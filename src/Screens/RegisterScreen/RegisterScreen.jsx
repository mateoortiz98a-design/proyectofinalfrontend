import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import './RegisterScreen.css'

export const RegisterScreen = () => {

    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    async function onSubmit(formData) {
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
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
        { name: '', email: '', password: '', confirmPassword: '' },
        onSubmit
    )

    if (success) {
        return (
            <div className="register-screen">
                <div className="register-card">
                    <div className="register-card__success-icon">✅</div>
                    <h2 className="register-card__title">¡Registro exitoso!</h2>
                    <p className="register-card__subtitle">
                        Te enviamos un mail de verificación a <strong>{formState.email}</strong>.
                        Revisá tu bandeja y hacé click en el link para activar tu cuenta.
                    </p>
                    <Link to="/login" className="register-card__btn">Ir al login</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="register-screen">
            <div className="register-card">
                <div className="register-card__header">
                    <h1 className="register-card__logo">💬 MiSlack</h1>
                    <h2 className="register-card__title">Crear cuenta</h2>
                    <p className="register-card__subtitle">Empezá a chatear con tu equipo</p>
                </div>

                {error && <div className="register-card__error">{error}</div>}

                <form onSubmit={handleSubmit} className="register-card__form">
                    <div className="register-card__field">
                        <label htmlFor="name" className="register-card__label">Nombre</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="register-card__input"
                            placeholder="Tu nombre"
                            value={formState.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="register-card__field">
                        <label htmlFor="email" className="register-card__label">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="register-card__input"
                            placeholder="tu@email.com"
                            value={formState.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="register-card__field">
                        <label htmlFor="password" className="register-card__label">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="register-card__input"
                            placeholder="Mínimo 6 caracteres"
                            value={formState.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="register-card__field">
                        <label htmlFor="confirmPassword" className="register-card__label">Confirmar contraseña</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className="register-card__input"
                            placeholder="Repetí tu contraseña"
                            value={formState.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="register-card__btn">Crear cuenta</button>
                </form>

                <p className="register-card__footer">
                    ¿Ya tenés cuenta? <Link to="/login" className="register-card__link">Iniciá sesión</Link>
                </p>
            </div>
        </div>
    )
}