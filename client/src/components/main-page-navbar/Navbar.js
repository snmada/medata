import React from 'react'
import logo from "../../logo/logo.svg"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faIdCardClip} from '@fortawesome/free-solid-svg-icons'
import "../main-page-navbar/Navbar.scss"

function Navbar() {
  return (
        <div className="navbar">
            <a href="/" className="logo">
                <img src={logo} width="130" height="30" href="/login"/>
            </a>
            {
                sessionStorage.getItem("loggedIn")?
                (
                    <>
                        {sessionStorage.getItem("role") == "admin" && (
                            <a href="/profile/doctors" className="back-profile"> 
                                <FontAwesomeIcon icon={faIdCardClip} className="icon"/>
                                Înapoi în Contul meu
                            </a>
                        )}
                        {sessionStorage.getItem("role") == "doctor" && (
                            <a href="/profile/appointments" className="back-profile"> 
                                <FontAwesomeIcon icon={faIdCardClip} className="icon"/>
                                Înapoi în Contul meu
                            </a>
                        )}
                        {sessionStorage.getItem("role") == "scheduler" && (
                            <a href="/profile/appointment-scheduler" className="back-profile"> 
                                <FontAwesomeIcon icon={faIdCardClip} className="icon"/>
                                Înapoi în Contul meu
                            </a>
                        )}
                    </>
                )
                :
                (
                    <>
                        <a href="/login" className="login-link"> 
                            <FontAwesomeIcon icon={faIdCardClip} className="icon"/>
                            Intră în cont
                        </a>
                    </>
                )
            }
        </div>
    )
}

export default Navbar