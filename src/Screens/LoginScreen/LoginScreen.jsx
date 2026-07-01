import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'

export const LoginScreen = () => {

    const navigate = useNavigate()
    const [error, setError] = useState(null)

    const initial_form_state = {
        email: '',
        password: ''
    }

    async function onSubmit(formData) {
        const response = await login(formData.email, formData.password)

        if (response.ok) {
            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('user_email', formData.email)
            navigate('/home')
        } else {
            setError(response.message)
        }
    }

    const { formState, handleChange, handleSubmit } = useForm(initial_form_state, onSubmit)

    return (
        <div>
            <h1>Iniciar sesion</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input id='email' name='email' type='email' value={formState.email} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input id='password' name='password' type='password' value={formState.password} onChange={handleChange} />
                </div>

                <button>Iniciar sesion</button>
            </form>
            <p>Si no tienes cuenta <Link to={'/register'}>Registrate</Link></p>
        </div>
    )
}