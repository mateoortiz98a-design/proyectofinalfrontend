import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { LoginScreen } from './Screens/LoginScreen/LoginScreen'
import { RegisterScreen } from './Screens/RegisterScreen/RegisterScreen'
import { VerifyScreen } from './Screens/VerifyScreen/VerifyScreen' 
import { HomeScreen } from './Screens/HomeScreen/HomeScreen'
import { ProfileScreen } from './Screens/ProfileScreen/ProfileScreen'
import { ForgotPasswordScreen } from './Screens/ForgotPasswordScreen/ForgotPasswordScreen'
import { ResetPasswordScreen } from './Screens/ResetPasswordScreen/ResetPasswordScreen'
import './App.css'
function isAuthenticated() {
    return !!localStorage.getItem('access_token')
}

const App = () => {
    return (
        <Routes>
            {/* Primero declaramos las rutas fijas y exactas de autenticación */}
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            
            {/* Blindamos la ruta de verificación */}
            <Route path='/verify' element={<VerifyScreen />} /> 
            
            <Route path='/home' element={<HomeScreen />} />
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path='/forgot-password' element={<ForgotPasswordScreen />} />
            <Route path='/reset-password' element={<ResetPasswordScreen />} />
            
            {/* Raíz del sitio */}
            <Route path='/' element={isAuthenticated() ? <Navigate to='/home' replace /> : <Navigate to='/login' replace />} />
            
            {/* Captura de rutas no encontradas (404 / Comodín) al final de todo */}
            <Route path='*' element={isAuthenticated() ? <Navigate to='/home' replace /> : <Navigate to='/login' replace />} />
        </Routes>
    )
}

export default App