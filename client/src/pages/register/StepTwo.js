import React, {useState} from 'react'
import "../register/Register.scss"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleExclamation} from '@fortawesome/free-solid-svg-icons'
import validator from 'validator'

function StepTwo({data, setData, prevPage, nextPage}) {

    const [errorLastname, setErrorLastname] = useState(false);
    const [errorFirstname, setErrorFirstname] = useState(false);
    const [errorCNP, setErrorCNP] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);

    function validateLastname() {
        if((/[a-zA-ZăâîșțĂÂÎȘȚ '-]+/i.test(data.lastname.trim())))
        {
            setErrorLastname(false);
            return 1;
        }
        else
        {
            setErrorLastname(true);
            return 0;
        }
    }

    function validateFirstname() {
        if((/[a-zA-ZăâîșțĂÂÎȘȚ '-]+/i.test(data.firstname.trim())))
        {
            setErrorFirstname(false);
            return 1;
        }
        else
        {
            setErrorFirstname(true);
            return 0;
        }
    }

    function validatePIN() {
        if(/^[1-9]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[1-4]\d|5[0-2]|99)(00[1-9]|0[1-9]\d|[1-9]\d\d)\d$/g.test(data.PIN))
        {
            setErrorCNP(false);
            return 1;
        }
        else
        {
            setErrorCNP(true);
            return 0;
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
    <>
        <div className="input-container">
            <input className="input"
                type="text"
                required
                value={data.lastname}
                onChange={(event) => setData({...data, lastname: event.target.value})}
            />
            <br></br>
            <label className="label">Nume</label>
            <div className={errorLastname? "error-icon" : ""}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
            <div className={errorLastname? "error-message" : ""}><p>Introduceți un nume valid!</p></div> 
        </div>

        <div className="input-container">
            <input className="input"
                type="text"
                required
                value={data.firstname}
                onChange={(event) => setData({...data, firstname: event.target.value})}
            />
            <br></br>
            <label className="label">Prenume</label>
            <div className={errorFirstname? "error-icon" : ""}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
            <div className={errorFirstname? "error-message" : ""}><p>Introduceți un prenume valid!</p></div> 
        </div>

        <div className="input-container">
            <input className="input"
                type="text"
                required
                value={data.PIN}
                onChange={(event) => setData({...data, PIN: event.target.value.trim()})}
            />
            <br></br>
            <label className="label">CNP (Cod Numeric Personal)</label>
            <div className={errorCNP? "error-icon" : ""}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
            <div className={errorCNP? "error-message" : ""}><p>Introduceți un CNP valid!</p></div> 
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
            <div className={errorEmail? "error-message" : ""}><p>Introduceți o adresă de email validă!</p></div>
        </div>

        <div className="form-footer">
            <div className="button">
                <button className="button-prev"
                    onClick={() => {
                        prevPage();
                    }}>Înapoi
                </button>

                <button className="button-next"
                    onClick={() => {
                        let lastname = validateLastname();
                        let firstname = validateFirstname();
                        let PIN = validatePIN();
                        let email = validateEmail();
                        if(lastname && firstname && PIN && email)
                        {
                            nextPage();
                        }
                    }}>Pasul următor
              </button>
            </div>
        </div>
    </>
  )
}

export default StepTwo