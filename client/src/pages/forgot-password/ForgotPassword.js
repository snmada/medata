import React, {useState} from 'react'
import "../forgot-password/ForgotPassword.scss"
import Axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleExclamation} from '@fortawesome/free-solid-svg-icons'
import validator from 'validator'
import logo from './../../logo/logo.svg'

function ForgotPassword() {

    const [errorUser, setErrorUser] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [loginStatus, setLoginStatus] = useState("");

    const [data, setData] = useState({
        user: "",
        email: "",
    })

    function forgotPassword() {
        Axios.post('http://localhost:3001/forgot-password',{
            id_user: data.user,
            email: data.email
        }).then((response) => {
            if(response.data.message == "success")
            {
                setLoginStatus("A fost trimis un e-mail pentru resetarea parolei!");
            }
            else if(response.data.message == "error")
            {
                setLoginStatus("Utilizator/e-mail inexistent!");
            }
            else
            {
                setLoginStatus("A intervenit o eroare!");
            }
        })
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

    function validateEmail() {
        if(validator.isEmail(data.email))
        {
          setErrorEmail(false);
          return 1;
        }
        else
        {
          setErrorEmail(true);
          return 0;
        }
    }

    return (
        <div className="forgot-password">
            <div className="container">
                <div className="inner-container">
                    <div className="form-container">
                        <div className="logo">
                            <a href="/"><img src={logo} width="160" height="30"/></a>
                        </div>
                        <div className="title">Resetare parolă</div>
                        <div className="form">
                            <div className="body">
                            Vă rugăm să introduceți adresa de e-mail pe care ați folosit-o la crearea contului.
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
                                <input className="input"
                                    type="text"
                                    required
                                    value={data.email}
                                    onChange={(event) => setData({...data, email: event.target.value.trim()})}
                                />
                                <br></br>
                                <label className="label">E-mail</label>
                                <div className={errorEmail? "error-icon" : ""}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                                <div className={errorEmail? "error-message" : ""}><p>Introduceți un email valid!</p></div>
                            </div>
                            <span>{loginStatus}</span>
                        </div>
                        <div className="footer">
                            <div className="button">
                            <button className="submit"
                                onClick={()=>{
                                    let user = validateUser();
                                    let email = validateEmail();
                                    if(user && email)
                                    {
                                        forgotPassword();
                                    }
                                }}>Resetare
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default ForgotPassword