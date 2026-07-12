import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { LoginScreen } from './Screens/LoginScreen/LoginScreen.jsx'
import { RegisterScreen } from './Screens/RegisterScreen/RegisterScreen.jsx'
import { VerifyScreen } from './Screens/VerifyScreen/VerifyScreen.jsx' // 👈 Importamos la nueva pantalla
import { HomeScreen } from './Screens/HomeScreen/HomeScreen.jsx'
import { ProfileScreen } from './Screens/ProfileScreen/ProfileScreen.jsx'
import { ForgotPasswordScreen } from './Screens/ForgotPasswordScreen/ForgotPasswordScreen.jsx'
import { ResetPasswordScreen } from './Screens/ResetPasswordScreen/ResetPasswordScreen.jsx'

function isAuthenticated() {
    return !!localStorage.getItem('access_token')
}

const App = () => {
    return (
        <Routes>
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/verify' element={<VerifyScreen />} /> {/* 👈 Agregamos la ruta pública */}
            <Route path='/home' element={<HomeScreen />} />
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path='/forgot-password' element={<ForgotPasswordScreen />} />
            <Route path='/reset-password' element={<ResetPasswordScreen />} />
            <Route path='/' element={isAuthenticated() ? <Navigate to='/home' /> : <Navigate to='/login' />} />
            <Route path='/*' element={isAuthenticated() ? <Navigate to='/home' /> : <Navigate to='/login' />} />
        </Routes>
    )
}

export default App