import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { LoginScreen } from './Screens/LoginScreen/LoginScreen'
import { RegisterScreen } from './Screens/RegisterScreen/RegisterScreen'
import { HomeScreen } from './Screens/HomeScreen/HomeScreen'
import { ProfileScreen } from './Screens/ProfileScreen/ProfileScreen'
import { ForgotPasswordScreen } from './Screens/ForgotPasswordScreen/ForgotPasswordScreen'
import { ResetPasswordScreen } from './Screens/ResetPasswordScreen/ResetPasswordScreen'

function isAuthenticated() {
    return !!localStorage.getItem('access_token')
}

const App = () => {
    return (
        <Routes>
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
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