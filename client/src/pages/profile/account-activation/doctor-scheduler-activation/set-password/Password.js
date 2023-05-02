import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import {useParams, useNavigate} from 'react-router-dom'
import '../set-password/Password.scss'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleExclamation, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import {Buffer} from 'buffer'

function Password() {

    Axios.defaults.withCredentials = true;

    const navigate = useNavigate();
    const param = useParams();

    const root = document.documentElement;

    const [errorPass, setErrorPass] = useState(false);
    const [errorConfirmPass, setErrorConfirmPass] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [classNamePass, setClassNamePass] = useState(true);
    const [hidePassword, setHidePassword] = useState(true);

    const [classNameCPass, setClassNameCPass] = useState(true);
    const [hideCPassword, setHideCPassword] = useState(true);

    function decodeString(str) {
      let buffer = Buffer.from(str, "base64");
      return buffer.toString("utf8");
    }

    useEffect(() => {
        Axios.post("http://localhost:3001/verify-credentials", {
          id: decodeString(param.id),
          token: decodeString(decodeString(param.token))
        }).then((response) => {
            if(response.data.message == "error")
            {
              navigate("/");
            }
        })
    }, []);

    function sendPassword() {
        Axios.post('http://localhost:3001/set-password/:id',{
          password: password,
          id: decodeString(param.id)
        }).then((response) => {
            if(response.data.message == "success")
            {
                navigate(`/account/activated/${param.token}/${param.id}`)
            }
        });
      };

    function setCorrect(id) {
        let text = document.querySelector(`#${id}`);
        text.style.color = "green";
    }

    function setIncorrect(id) {
        let text = document.querySelector(`#${id}`);
        text.style.color = "red";
    }

    var arr = ["0", "0", "0", "0", "0"];

    function validatePassword() {
        if(password.length < 12)
        {
            setIncorrect("characters");
            arr[0] = "0";
        }
        else
        {
            setCorrect("characters");
            arr[0] = "1";
        }

        if(/[1-9]/g.test(password))
        {
            setCorrect("digit");
            arr[1] = "1";
        }
        else
        {
            setIncorrect("digit");
            arr[1] = "0";
        }

        if(/[a-z]/g.test(password))
        {
            setCorrect("lower-letter");
            arr[2] = "1";
        }
        else
        {
            setIncorrect("lower-letter");
            arr[2] = "0";
        }

        if(/[A-Z]/g.test(password))
        {
            setCorrect("capital-letter");
            arr[3] = "1";
        }
        else
        {
            setIncorrect("capital-letter");
            arr[3] = "0";
        }

        if(/[.!?\\-]/g.test(password))
        {
            setCorrect("sign");
            arr[4] = "1";
        }
        else
        {
            setIncorrect("sign");
            arr[4] = "0";
        }

        if(arr.includes("0"))
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    function validateConfirmedPassword() {
        if(confirmPassword === password)
        {
          setErrorConfirmPass(false);
          return 1;
        }
        else
        {
          setErrorConfirmPass(true);
          return 0;
        }
    }

    useEffect(()=>{
        validatePassword();
    },[password])

    const handleInputChange = event => {
        setClassNamePass(true);
        if(classNamePass)
        {
            setPassword(event.target.value.trim())
        }
    }


  return (
    <div className="password-container">
        <div className="container">
            <div className="title">Setare parolă</div>
            <div className="form-container">
                <div className="input-container">
                    <input className={classNamePass? "input-pass":"input"}
                        type={hidePassword? "password":"text"}
                        required
                        value={password}
                        onChange={handleInputChange}
                    />  
                    <br></br>
                    <label className="label">Parolă</label>
                    {root.style.setProperty('--visibilityP', password != ""? 'visible':'hidden')}
                    {root.style.setProperty('--indentP', password != ""? '40px':'0px')}
                    <div className="eye-icon-pass" onClick={() => setHidePassword(!hidePassword)}
                        >{hidePassword? <FontAwesomeIcon icon={faEyeSlash} className="icon"/> : <FontAwesomeIcon icon={faEye} className="icon"/>}
                    </div>
                    <div className={errorPass? "error-icon" : ""}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                    <div className={errorPass? "error-message" : ""}><p>Parola trebuie sa contina minim 8 caractere!</p></div>
                </div>
                <div className="input-container">
                    <input className={classNameCPass? "input-confirmPass":"input"}
                        type={hideCPassword? "password":"text"}
                        required
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value.trim()) && setClassNameCPass(!classNameCPass)}
                    />
                    <br></br>
                    <label className="label">Confirmare parolă</label>
                    {root.style.setProperty('--visibilityCP', confirmPassword != ""? 'visible':'hidden')}
                    {root.style.setProperty('--indentCP', confirmPassword != ""? '40px':'0px')}
                    <div className="eye-icon-confrimPass" onClick={() => setHideCPassword(!hideCPassword)}
                        >{hideCPassword? <FontAwesomeIcon icon={faEyeSlash} className="icon"/> : <FontAwesomeIcon icon={faEye} className="icon"/>}
                    </div>
                    <div className={errorConfirmPass? "error-icon" : ""}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                    <div className={errorConfirmPass? "error-message" : ""}><p>Parolele introduse nu corespund!</p></div>
                </div>
                <div className="pass-requirements">
                    <p>Parola trebuie să conțină: </p>
                    <ul>
                        <li id="characters"> minim 12 caractere </li>
                        <li id="lower-letter">cel puțin o literă mică</li>
                        <li id="capital-letter">cel puțin o literă mare</li>
                        <li id="digit">cel puțin o cifră</li>
                        <li id="sign">cel puțin un semn de punctuație /.-?!</li>
                    </ul>
                </div>
            </div>
            <div className="button">
                <button className="button-submit"
                    onClick={()=>{
                        let password = validatePassword();
                        let confirmPassword = validateConfirmedPassword();
                        if(password && confirmPassword)
                        {
                            sendPassword();
                        }
                    }}>Salvare
                </button>
            </div>
        </div>
    </div>
  )
}

export default Password