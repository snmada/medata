import React from 'react'
import './App.css'
import './components/main-page-navbar/Navbar.scss'
import {Routes, Route, useLocation} from 'react-router-dom'
import Register from "./pages/register/MultiStepForm"
import Login from "./pages/login/Login"
import Navbar from "./components/main-page-navbar/Navbar"
import UserNavbar from './components/user-navbar/UserNavbar'
import Home from './pages/landing-page/home/Home'
import ProtectedRoutes from './ProtectedRoutes'
import DoctorSchedulerActivation from './pages/profile/account-activation/doctor-scheduler-activation/set-password/Password'
import Activated from './pages/profile/account-activation/success-activation/Activated'
import ForgotPassword from './pages/forgot-password/ForgotPassword'
import ResetPassword from './pages/reset-password/ResetPassword'

function App() {
    const location = useLocation();
  return (
        <div className="App">
            {(location.pathname !== '/register' && location.pathname !== '/login' && location.pathname !== '/forgot-password' && !(location.pathname.match('/profile/*'))) && <Navbar/>}
            {location.pathname.match('/profile/*') && <UserNavbar/>}  
            <Routes>
                <Route path="/" exact element={<Home/>}/>
                <Route path="/register" exact element={<Register/>}/>
                <Route path="/login" exact element={<Login/>}/>
                <Route path="/profile/*" element={<ProtectedRoutes/>}/>
                <Route path="/account/activated/:token/:id" exact element={<Activated/>}/>
                <Route path="/account/password/:token/:id" exact element={<DoctorSchedulerActivation/>}/>
                <Route path="/forgot-password" exact element={<ForgotPassword/>}/>
                <Route path="/account/reset-password/:token/:id" exact element={<ResetPassword/>}/>
            </Routes>
        </div>
    )
}

export default App