import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { LoginScreen } from './Screens/LoginScreen/LoginScreen'
import { RegisterScreen } from './Screens/RegisterScreen/RegisterScreen'
import { HomeScreen } from './Screens/HomeScreen/HomeScreen'

function isAuthenticated() {
    return !!localStorage.getItem('access_token')
}

const App = () => {
    return (
        <Routes>
            <Route
                path='/login'
                element={<LoginScreen />}
            />
            <Route
                path='/register'
                element={<RegisterScreen />}
            />
            <Route
                path='/home'
                element={<HomeScreen />}
            />
            <Route
                path='/'
                element={isAuthenticated() ? <Navigate to='/home' /> : <Navigate to='/login' />}
            />
            <Route
                path='/*'
                element={isAuthenticated() ? <Navigate to='/home' /> : <Navigate to='/login' />}
            />
        </Routes>
    )
}

export default App