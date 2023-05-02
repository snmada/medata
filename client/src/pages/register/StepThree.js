import React, {useState, useEffect} from 'react'
import "../register/Register.scss"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleExclamation, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import  Axios  from 'axios'

function StepThree({data, setData, prevPage, nextPage}) {

    const root = document.documentElement;
    const [errorConfirmPass, setErrorConfirmPass] = useState(false);

    const [classNamePass, setClassNamePass] = useState(true);
    const [hidePassword, setHidePassword] = useState(true);

    const [classNameCPass, setClassNameCPass] = useState(true);
    const [hideCPassword, setHideCPassword] = useState(true);

    var array = ["0", "0", "0", "0", "0"];

    function setCorrect(id) {
        let text = document.querySelector(`#${id}`);
        text.style.color = "green";
    }

    function setIncorrect(id) {
        let text = document.querySelector(`#${id}`);
        text.style.color = "red";
    }

    function validatePassword() {

        if(data.password.trim().length < 12)
        {
            setIncorrect("characters");
            array[0] = "0";
        }
        else
        {
            setCorrect("characters");
            array[0] = "1";
        }

        if(/[1-9]/g.test(data.password.trim()))
        {
            setCorrect("digit");
            array[1] = "1";
        }
        else
        {
            setIncorrect("digit");
            array[1] = "0";
        }

        if(/[a-z]/g.test(data.password.trim()))
        {
            setCorrect("lower-letter");
            array[2] = "1";
        }
        else
        {
            setIncorrect("lower-letter");
            array[2] = "0";
        }

        if(/[A-Z]/g.test(data.password.trim()))
        {
            setCorrect("capital-letter");
            array[3] = "1";
        }
        else
        {
            setIncorrect("capital-letter");
            array[3] = "0";
        }

        if(/[.!?\\-]/g.test(data.password.trim()))
        {
            setCorrect("sign");
            array[4] = "1";
        }
        else
        {
            setIncorrect("sign");
            array[4] = "0";
        }

       if(array.includes("0"))
       {
           return false;
       }
       else
       {
           return true;
       }
    }

    function validateConfirmedPassword() {
        if(data.confirmPassword === data.password)
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

    function capitalizeFirstLetter(name) {
        let aux = [];
        name.split(/[ -]+/).forEach(element => {
            aux.push(element.charAt(0).toUpperCase() + element.slice(1).toLowerCase() + "")
        });
        return aux.join(' ');
    }

    function register() {
        Axios.post('http://localhost:3001/register',{
        TIN: data.TIN,  
        firstname: capitalizeFirstLetter(data.firstname.trim()),
        lastname: capitalizeFirstLetter(data.lastname.trim()),
        PIN: data.PIN,
        email: data.email,  
        password: data.password                           
        }).then((response) => {
            sessionStorage.setItem("message", response.data.message);
        });
    };

    useEffect(()=>{
        validatePassword();
    },[data.password])

    const handleInputChange = event => {
        setClassNamePass(true);
        if(classNamePass)
        {
            setData({...data, password: event.target.value.trim()})
        }
    }

  return (
      <>

        <div className="input-container">
            <input className={classNamePass? "input-pass":"input"}
                type={hidePassword? "password":"text"}
                required
                value={data.password}
                onChange={handleInputChange}
            />  
            <br></br>
            <label className="label">Parolă</label>
            {root.style.setProperty('--visibilityP', data.password != ""? 'visible':'hidden')}
            {root.style.setProperty('--indentP', data.password != ""? '40px':'0px')}
            <div className="eye-icon-pass" onClick={() => setHidePassword(!hidePassword)}
                >{hidePassword? <FontAwesomeIcon icon={faEyeSlash} className="icon"/> : <FontAwesomeIcon icon={faEye} className="icon"/>}
            </div>
        </div>

        <div className="input-container">
            <input className={classNameCPass? "input-confirmPass":"input"}
                type={hideCPassword? "password":"text"}
                required
                value={data.confirmPassword}
                onChange={(event) => setData({...data, confirmPassword: event.target.value.trim()}) && setClassNameCPass(!classNameCPass)}
            />
            <br></br>
            <label className="label">Confirmare parolă</label>
            {root.style.setProperty('--visibilityCP', data.confirmPassword != ""? 'visible':'hidden')}
            {root.style.setProperty('--indentCP', data.confirmPassword != ""? '40px':'0px')}
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
                <li id="sign">cel puțin un caracter special /.-?!</li>
            </ul>


        </div>

        <div className="form-footer">
            <div className="button">
                <button className="button-prev"
                    onClick={()=>{
                        prevPage();
                    }}>Înapoi
                </button>
                <button className="button-next"
                    onClick={()=>{
                        let password = validatePassword();
                        let confirmedPassword = validateConfirmedPassword();
                        if(password && confirmedPassword)
                        {
                            register();
                            nextPage();
                        }
                    }}>Finalizare
                </button>
            </div>
        </div>
      </>
  );
}

export default StepThree