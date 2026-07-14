import BASE_URL from '../../config.js'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import '../../styles/auth.css'
import './RegisterScreen.css'

export const RegisterScreen = () => {

    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [emergencyLink, setEmergencyLink] = useState(null) // 🔥 Estado para el link de rescate
    const [loading, setLoading] = useState(false)

    async function onSubmit(formData) {
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        setError(null)
        setLoading(true)

        try {
            const response = await fetch(`${BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            })
            const data = await response.json()

            // Cambié la validación a data.ok o response.ok (según manejes tus respuestas)
            if (response.ok || data.ok) {
                setSuccess(true)
                setError(null)
                
                // 🔥 Capturamos el link de emergencia si viene en la respuesta del backend
                if (data.debugLink) {
                    setEmergencyLink(data.debugLink)
                }
            } else {
                setError(data.message || 'Error al registrar el usuario')
            }
        } catch {
            setError('Error al conectar con el servidor')
        } finally {
            setLoading(false)
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

                    {/* 🔥 BOTÓN DE EMERGENCIA: Se muestra sólo si el correo real no pudo salir */}
                    {emergencyLink && (
                        <div style={{
                            marginTop: '15px',
                            padding: '12px',
                            backgroundColor: '#fff3cd',
                            border: '1px solid #ffeba0',
                            borderRadius: '6px',
                            textAlign: 'center'
                        }}>
                            <p style={{ color: '#856404', fontSize: '13px', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                                ⚠️ <strong>Entorno de pruebas:</strong> Si el correo demora por restricciones del hosting, podés simular la activación haciendo clic acá abajo:
                            </p>
                            <a 
                                href={emergencyLink} 
                                style={{ 
                                    color: '#6c5ce7', 
                                    fontWeight: 'bold', 
                                    textDecoration: 'underline',
                                    fontSize: '14px' 
                                }}
                            >
                                Activar cuenta directamente ➔
                            </a>
                        </div>
                    )}

                    <Link to="/login" className="register-card__btn" style={{ marginTop: '15px' }}>Ir al login</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="register-screen">
            <div className="register-card">
                <div className="register-card__header">
                    <div className="auth-logo">
                        <span className="auth-logo__badge">M</span>
                        <span className="auth-logo__text">MiSlack</span>
                    </div>
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
                            disabled={loading}
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
                            disabled={loading}
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
                            disabled={loading}
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
                            disabled={loading}
                            required
                        />
                    </div>

                    <button type="submit" className="register-card__btn" disabled={loading}>
                        {loading ? (<><span className="auth-spinner auth-spinner--btn" /> Creando cuenta...</>) : 'Crear cuenta'}
                    </button>
                </form>

                <p className="register-card__footer">
                    ¿Ya tenés cuenta? <Link to="/login" className="register-card__link">Iniciá sesión</Link>
                </p>
            </div>

            {loading && (
                <div className="auth-loading-overlay">
                    <div className="auth-loading-box">
                        <span className="auth-spinner" />
                        <p>Creando tu cuenta...</p>
                    </div>
                </div>
            )}
        </div>
    )
}