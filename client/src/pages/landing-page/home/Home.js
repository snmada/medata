import React from 'react'
import './Home.scss'
import {Link} from 'react-router-dom'
import logo from '../../../logo/logo-MainPage.svg'

function Home() {
  return (
        <div className="home">
            <div className="container">
                <div className="logo-container">
                    <object data={logo} className="logo"></object>
                </div>
                <div className="logo-footer">
                    <div className="text">Pacienți. Medici. Tehnologie.</div>
                </div>
                <div className="title">
                    <div className="text">Aplicație concepută pentru gestionarea activității unităților medicale mici și mijlocii din România.</div>
                </div>
                <div className="container-footer">
                    <Link className="login-button" to="/login">Autentificare</Link>
                    <Link className="register-button" to="/register">Înregistrare</Link>
                </div>
            </div>
        </div>
    )
}

export default Home