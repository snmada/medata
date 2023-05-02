import React, {useEffect, useState} from 'react'
import Axios from 'axios'
import "../login/Login.scss"
import {useNavigate} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleExclamation, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import logo from './../../logo/logo.svg'

function Login() {

    Axios.defaults.withCredentials = true;

    const root = document.documentElement;
    const [loginStatus, setLoginStatus] = useState("");
    const [data, setData] =  useState({
        user: "",
        password: ""
    })

    const [errorUser, setErrorUser] = useState(false);
    const [errorPass, setErrorPass] = useState(false);
    const [classNamePass, setClassNamePass] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            console.log(response);
        })
    }, [sessionStorage.getItem("loggedIn")]);
    
    const navigate = useNavigate();

    function login() {
        Axios.post('http://localhost:3001/login',{
            user: data.user,
            password: data.password,
        }).then((res) =>{
            if(res.data.message)
            {
                setLoginStatus(res.data.message);
            }
            else
            {
                sessionStorage.setItem("loggedIn", true);
                sessionStorage.setItem("UID", res.data.id_user);
                sessionStorage.setItem("role", res.data.role);
                sessionStorage.setItem("TIN", res.data.TIN);
                sessionStorage.setItem("id_TIN", res.data.id_TIN);

                if(res.data.role == "admin")
                {
                    navigate("/profile/doctors"); 
                }
                else if(res.data.role == "doctor")
                {
                    navigate("/profile/appointments"); 
                }
                else if(res.data.role == "scheduler")
                {
                    navigate("/profile/appointment-scheduler"); 
                }
            }
        });
    };

    function validateUser() {
        if(data.user === "" || data.user.slice(0, 3) != "UID" || data.user.length != 9)
        {
            setErrorUser(true);
            return 0;
        }
        else
        {
            setErrorUser(false);
            return 1;
        }
    }

    function validatePassword() {
        if(data.password === "")
        {
            setErrorPass(true);
            return 0;
        }
        else
        {
            setErrorPass(false);
            return 1;
        }
    }

    return (
       <div className="login">
           <div className="container">
               <div className="inner-container">
               <div className="form-container">
                        <div className="logo">
                            <a href="/"><img src={logo} width="160" height="30"/></a>
                        </div> 
                    <div className="title">Autentificare</div>
                    <div className="form">
                        <div className="body">
                            <div className="input-container">
                            <input className="input"
                                type="text"
                                required
                                value={data.user}
                                onChange={(event) => setData({...data, user: event.target.value.trim()})}
                            />
                            <br></br>
                            <label className="label">Utilizator</label>
                            <div className={errorUser? "error-icon" : ""}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                            <div className={errorUser? "error-message" : ""}><p>Introduceți un ID valid!</p></div>
                            </div>
                            <div className="input-container">
                            <input className={classNamePass? "input-pass":"input"}
                                type={hidePassword? "password":"text"}
                                required
                                value={data.password}
                                onChange={(event) => {setData({...data, password: event.target.value.trim()}); setClassNamePass(true)}}
                            />
                            <br></br>
                            <label className="label">Parolă</label>
                            {root.style.setProperty('--visibility', data.password != ""? 'visible':'hidden')}
                            {root.style.setProperty('--indent', data.password != ""? '40px':'0px')}
                            <div className="eye-icon-pass" onClick={() => setHidePassword(!hidePassword)}
                                >{hidePassword? <FontAwesomeIcon icon={faEyeSlash} className="icon"/> : <FontAwesomeIcon icon={faEye} className="icon"/>}
                            </div>
                            <div className={errorPass? "error-icon" : ""}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                            <div className={errorPass? "error-message" : ""}><p>Introduceți parola!</p></div>
        
                            </div>
                            <span>{loginStatus}</span>
                        </div>
                        <div className="footer">
                        <div className="register-link">
                        <a href="./forgot-password">Mi-am uitat parola</a> / <span>Nu aveți cont? <a href="./register">Înregistrare</a></span>
                        </div>
                            <div className="button">
                            <button className="submit"
                                onClick={()=>{
                                    let user = validateUser();
                                    let password = validatePassword();
                                    if(user && password)
                                    {
                                        login();
                                    }
                                }}>Autentificare
                            </button>
                            </div>
                        </div>
                    </div>
               </div>
               </div>
           </div>
       </div>
    );
}

export default Login