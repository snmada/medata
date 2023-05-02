import React, {useState, useEffect} from 'react'
import "../user-navbar/UserNavbar.scss"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser, faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import {SidebarData as admin} from "../sidebar/admin/SidebarData"
import {SidebarData as doctor} from "../sidebar/doctor/SidebarData"
import {SidebarData as scheduler} from "../sidebar/scheduler/SidebarData"
import {useNavigate} from "react-router-dom"
import Axios from 'axios'
import logo from "../../logo/logo-blue.svg"

function UserNavbar() {

    Axios.defaults.withCredentials = true;
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getName(sessionStorage.getItem("UID"), sessionStorage.getItem("role"));
    }, [])

    function getName(UID, role) {
        Axios.post('http://localhost:3001/profile', {
            UID: UID,
            role: role
        }).then((response) => {
            if(response.data.length){
                setName(response.data[0].lastname + " " + response.data[0].firstname);
            }
            else{
                sessionStorage.removeItem("loggedIn");
                sessionStorage.removeItem("UID");
                sessionStorage.removeItem("role");
                sessionStorage.removeItem("id");
                sessionStorage.removeItem("id_TIN");
                sessionStorage.removeItem("TIN");
                navigate('/');
            }
        })
    }

  return (
        <div className="usernavbar">
            <div className="nav">
                <a href="/" className="logo">
                    <img src={logo} width="140" height="70" href="/login"/>
                </a>
                <div className="user">
                    <FontAwesomeIcon icon={faUser} className="icon"/> {name}
                </div>
                <div className="logout">
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="icon" onClick={() => {
                        sessionStorage.removeItem("loggedIn");
                        sessionStorage.removeItem("UID");
                        sessionStorage.removeItem("role");
                        sessionStorage.removeItem("id");
                        sessionStorage.removeItem("id_TIN");
                        sessionStorage.removeItem("TIN");
                        navigate('/');
                    }}/>
                </div>
            </div>
            <div className="sidebar">
                <ul className="component">
                    {
                        sessionStorage.getItem("role") === "admin" && (
                            <>
                                {
                                    admin.map((val, key) => {
                                        return(
                                            <li key = {key}
                                                className="element"
                                                id = {window.location.pathname.match(val.link)? "active" : ""}
                                                onClick = {() => {
                                                    window.location.pathname = val.link;
                                                }}
                                            >
                                                <div className="icon">{val.icon}</div>
                                                <div className="title active">{val.title}</div>
                                            </li>
                                        )
                                    })
                                }
                            </>
                        )
                    }
                    {
                        sessionStorage.getItem("role") === "doctor" && (
                            <>
                                {
                                    doctor.map((val, key) => {
                                        return(
                                            <li key = {key}
                                                className="element"
                                                id = {window.location.pathname.match(val.link)? "active" : ""}
                                                onClick = {() => {
                                                    window.location.pathname = val.link;
                                                }}
                                            >
                                                <div className="icon">{val.icon}</div>
                                                <div className="title active">{val.title}</div>
                                            </li>
                                        )
                                    })
                                }
                            </>
                        )
                    }
                    {
                        sessionStorage.getItem("role") === "scheduler" && (
                            <>
                                {
                                    scheduler.map((val, key) => {
                                        return(
                                            <li key = {key}
                                                className="element"
                                                id = {window.location.pathname.match(val.link)? "active" : ""}
                                                onClick = {() => {
                                                    window.location.pathname = val.link;
                                                }}
                                            >
                                                <div className="icon">{val.icon}</div>
                                                <div className="title active">{val.title}</div>
                                            </li>
                                        )
                                    })
                                }
                            </>
                        )
                    }
                </ul>
            </div>
        </div>
    )
}

export default UserNavbar