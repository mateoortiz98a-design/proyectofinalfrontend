import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router'
import BASE_URL from '../../config.js'
import '../../styles/auth.css'
import './VerifyScreen.css' // 🔥 Vinculamos el nuevo archivo CSS modular

export const VerifyScreen = () => {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verificando tu cuenta, por favor espera...')

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token')
            
            if (!token) {
                setStatus('error')
                setMessage('Falta el token de verificación en la URL.')
                return
            }

            try {
                const response = await fetch(`${BASE_URL}/api/auth/verify-email?verification_token=${token}`)
                const data = await response.json()

                if (response.ok || data.ok) {
                    setStatus('success')
                    setMessage(data.message || '¡Cuenta verificada con éxito!')
                } else {
                    setStatus('error')
                    setMessage(data.message || 'El token es inválido o ya expiró.')
                }
            } catch (error) {
                setStatus('error')
                setMessage('Error al conectar con el servidor.')
            }
        }

        verifyEmail()
    }, [searchParams])

    return (
        <div className="verify-screen">
            <div className="verify-card">
                <div className="verify-card__header">
                    <div className="auth-logo" style={{ justifyContent: 'center', width: '100%' }}>
                        <span className="auth-logo__badge">M</span>
                        <span className="auth-logo__text">MiSlack</span>
                    </div>
                </div>

                {status === 'verifying' && (
                    <div className="verify-card__body">
                        <span className="auth-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px', marginBottom: '15px' }} />
                        <h2 className="verify-card__title">Procesando...</h2>
                        <p className="verify-card__subtitle">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="verify-card__body">
                        <div className="verify-card__icon verify-card__icon--success">✅</div>
                        <h2 className="verify-card__title">¡Cuenta verificada!</h2>
                        <p className="verify-card__subtitle">{message}</p>
                        <Link to="/login" className="verify-card__btn">Ir al iniciar sesión</Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="verify-card__body">
                        <div className="verify-card__icon verify-card__icon--error">❌</div>
                        <h2 className="verify-card__title">Algo salió mal</h2>
                        <p className="verify-card__subtitle">{message}</p>
                        <Link to="/register" className="verify-card__link">Volver a intentar el registro</Link>
                    </div>
                )}
            </div>
        </div>
    )
}