import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router'
import BASE_URL from '../../config.js'

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
                // Modificamos para pegarle a tu endpoint del backend con la query correcta
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
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#3f0e40',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                maxWidth: '400px',
                width: '100%'
            }}>
                {status === 'verifying' && <h2 style={{ color: '#666' }}>⏳ {message}</h2>}
                {status === 'success' && (
                    <>
                        <h2 style={{ color: '#28a745' }}>✅ ¡Excelente!</h2>
                        <p style={{ color: '#333', margin: '15px 0' }}>{message}</p>
                        <Link to="/login" style={{
                            display: 'inline-block',
                            backgroundColor: '#3f0e40',
                            color: 'white',
                            padding: '10px 20px',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                        }}>Ir al Login</Link>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <h2 style={{ color: '#dc3545' }}>❌ Error de Verificación</h2>
                        <p style={{ color: '#333', margin: '15px 0' }}>{message}</p>
                        <Link to="/register" style={{ color: '#3f0e40', fontWeight: 'bold' }}>Volver a intentar el registro</Link>
                    </>
                )}
            </div>
        </div>
    )
}