import React, {useEffect, useState}  from 'react'
import "../register/Register.scss"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleExclamation} from '@fortawesome/free-solid-svg-icons'
import  Axios  from 'axios'

function StepOne({data, setData, nextPage}) {

    const [error, setError] = useState(false);
    const [status, setStatus] = useState("");
    const [code, setCode] = useState("");

    function verifyTIN(){
        Axios.post('http://localhost:3001/register/TIN',{
        TIN: data.TIN                                   
        }).then((response) => {
            setStatus(response.data.message);
            sessionStorage.setItem("code", response.data.code);
            setCode(response.data.code);
        });
    };

    useEffect(() => {
        setInterval(() => {
            setCode(sessionStorage.getItem("code"));
        }, [status])
    }, [1000]);

    function validateTIN() {
        sessionStorage.setItem("code", "");
        if(data.TIN.length != 12 || data.TIN === "" || data.TIN.substring(0,2) != "RO")
        {
            setError(true);
        } 
        else 
        {
            setError(false);
            return 1;
        }
    }

    useEffect(()=>{
        if(code == "1")
        {
            nextPage();
            sessionStorage.setItem("code", "");
        }
    }, [code]);


  return (
    <>
        <div  className="input-container">
            <input className="input"
                type="text"
                required
                value={data.TIN}
                onChange={(event) => setData({...data, TIN: event.target.value.trim()})}
            />
            <br></br>
            <label className="label">CIF-ul unității medicale</label>
            <div className={error? "error-icon" : ""}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
            <div className={error? "error-message" : ""}><p>Introduceți un CIF valid!</p></div>
        </div>

        <span>{status}</span>
        <div className="form-footer">
            <div className="register-link">
                <p>Aveți un cont deja? <a href="./login">Autentificare</a></p>
            </div>
            <div className="button">
                <button className="button-next"
                    onClick={() => {
                        if(validateTIN())
                        {
                            verifyTIN();
                        }
                        if(code === "1")
                        {
                            {nextPage()}
                            setCode("");
                        }
                    }}>Pasul următor
                </button>
            </div>
        </div>
    </>
  );
}

export default StepOne