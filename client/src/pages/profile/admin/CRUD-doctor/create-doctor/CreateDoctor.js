import React, {useState} from 'react'
import "../create-doctor/CreateDoctor.scss"
import Axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTriangleExclamation, faCircleExclamation} from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from 'react-router-dom'
import AlertMessage from '../../../../../components/alert-message/AlertMessage'
import ConfirmDialog from '../../../../../components/confirm-dialog/ConfirmDialog'
import validator from 'validator'

function CreateDoctor() {

    const navigate = useNavigate();

    const [alertMessage, setAlertMessage] = useState("");
    const [close, setClose] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [errorLastname, seterrorLastname] = useState(false);
    const [errorFirstname, seterrorFirstname] = useState(false);
    const [errorPIN, seterrorPIN] = useState(false);
    const [errorEmail, seterrorEmail] = useState(false);
    const [errorSpecialty, seterrorSpecialty] = useState(false);
    const [errorPhoneNumber, seterrorPhoneNumber] = useState(false);

    const [data, setData] = useState({
        lastname: "",
        firstname: "",
        PIN: "",
        medical_specialty: "",
        phone_number: "",
        email: ""
    })

    const dataWarning = ({
        icon: <FontAwesomeIcon icon={faTriangleExclamation} className="icon"/>,
        text: "Sunteți sigur că doriți să renunțați? \r\n Datele introduse nu vor fi salvate! ",
        button: "Renunțare"
    })
    
    function validateLastname() {
        if((/[a-zăâîșțĂÂÎȘȚ -]+/i.test(data.lastname.trim())))
        {
            seterrorLastname(false);
            return 1;
        }
        else
        {
            seterrorLastname(true);
            return 0;
        }
    }

    function validateFirstname() {
        if((/[a-zăâîșțĂÂÎȘȚ -]+/i.test(data.firstname.trim())))
        {
            seterrorFirstname(false);
            return 1;
        }
        else
        {
            seterrorFirstname(true);
            return 0;
        }
    }

    function validatePIN() {
        if(/^[1-9]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[1-4]\d|5[0-2]|99)(00[1-9]|0[1-9]\d|[1-9]\d\d)\d$/g.test(data.PIN))
        {
            seterrorPIN(false);
            return 1;
        }
        else
        {
            seterrorPIN(true);
            return 0;
        }
    }

    function validateEmail() {
        if(validator.isEmail(data.email))
        {
          seterrorEmail(false);
          return 1;
        }
        else
        {
          seterrorEmail(true);
          return 0;
        }
    }

    function validateSpecialty() {
        if((/[a-zăâîșțĂÂÎȘȚ .,-]+/i.test(data.medical_specialty.trim())))
        {
            seterrorSpecialty(false);
            return 1;
        }
        else
        {
            seterrorSpecialty(true);
            return 0;
        }
    }

    function validatePhoneNumber() {
        if(data.phone_number.length == 10 && (/[0-9]+/.test(data.phone_number)) )
        {
            seterrorPhoneNumber(false);
            return 1;
        }
        else
        {
            seterrorPhoneNumber(true);
            return 0;
        }
    }

    function displayAlertMessage() {
        if(close === false)
        {
            return <AlertMessage setClose={setClose} alertMessage={alertMessage}/>
        }
    }

    function capitalizeFirstLetter(name) {
        let aux = [];
        name.split(/[ -]+/).forEach(element => {
            aux.push(element.charAt(0).toUpperCase() + element.slice(1).toLowerCase() + "")
        });
        return aux.join(' ');
    }

    function addDoctor() {
        Axios.post('http://localhost:3001/profile/add-doctor',{
            id_TIN: sessionStorage.getItem("id_TIN"),
            lastname: capitalizeFirstLetter(data.lastname.trim()),
            firstname: capitalizeFirstLetter(data.firstname.trim()),
            PIN: data.PIN,
            medical_specialty: data.medical_specialty.trim().toLowerCase(),
            phone_number: data.phone_number,
            email: data.email
        }).then((response) => {
            if(response.data.error === undefined)
            {
                setClose(false);
                setAlertMessage({
                    message: "Datele au fost salvate cu succes!", 
                    type: "success"
                });
            }
            else
            {
                setClose(false);
                setAlertMessage({
                    message: "A intervenit o eroare", 
                    type: "error"
                });
            }
        }).catch(()=>{
            setClose(false);
            setAlertMessage({
                message: "A intervenit o eroare!", 
                type: "error"
            });
        })
    }

    function displayConfirmDialog() {
        if(openDialog == true)
        {
            return <ConfirmDialog setOpenDialog={setOpenDialog} setConfirm={setConfirm} dataWarning={dataWarning}/>
        }
        else
        {
            if(confirm == true)
            {
                navigate('/profile/doctors');
            }
        }
    }

    function reset() {
        window.location.reload();
    }

  return (
    <div className="admin">
        <div className="admin-container">
            {displayAlertMessage()}
            {displayConfirmDialog()}
            <div className="create-doctor-container">
                <div className="title">Înregistrare medic</div>
                <div className="info-container">
                    <div className="first-container">
                        <div className="input-container">
                            <input className="input"
                                type="text"
                                required
                                value={data.lastname}
                                onChange={(event) => setData({...data, lastname: event.target.value})}
                            />
                            <br></br>
                            <label className="label">Nume</label>
                            <div className={errorLastname? "error-icon" : "error-icon active"}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                            <div className={errorLastname? "error-message" : "error-message active"}><p>Introduceți un nume valid!</p></div>
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
                            <div className={errorFirstname? "error-icon" : "error-icon active"}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                            <div className={errorFirstname? "error-message" : "error-message active"}><p>Introduceți un prenume valid!</p></div>
                        </div>
                        <div className="input-container">
                            <input className="input"
                                type="text"
                                required
                                value={data.PIN}
                                onChange={(event) => setData({...data, PIN: event.target.value.trim()})}
                            />
                            <br></br>
                            <label className="label">CNP</label>
                            <div className={errorPIN? "error-icon" : "error-icon active"}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                            <div className={errorPIN? "error-message" : "error-message active"}><p>Introduceți un CNP valid!</p></div>
                        </div>
                    </div>
                    <div className="second-container">
                        <div className="input-container">
                            <input className="input"
                                type="text"
                                required
                                value={data.medical_specialty}
                                onChange={(event) => setData({...data, medical_specialty: event.target.value})}
                            />
                            <br></br>
                            <label className="label">Specialitate</label>
                            <div className={errorSpecialty? "error-icon" : "error-icon active"}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                            <div className={errorSpecialty? "error-message" : "error-message active"}><p>Introduceți o specialitate validă!</p></div>
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
                            <div className={errorEmail? "error-icon" : "error-icon active"}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                            <div className={errorEmail? "error-message" : "error-message active"}><p>Introduceți un email valid!</p></div>
                        </div>
                        <div className="input-container">
                            <input className="input"
                                type="text"
                                required
                                value={data.phone_number}
                                onChange={(event) => setData({...data, phone_number: event.target.value.trim()})}
                            />
                            <br></br>
                            <label className="label">Telefon</label>
                            <div className={errorPhoneNumber? "error-icon" : "error-icon active"}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                            <div className={errorPhoneNumber? "error-message" : "error-message active"}><p>Introduceți un număr valid!</p></div>
                        </div>
                    </div>
                </div>
                <div className="button-container">
                    <button onClick={() => {
                        let lastname = validateLastname();
                        let firstname = validateFirstname();
                        let PIN = validatePIN();
                        let specialty = validateSpecialty();
                        let email = validateEmail();
                        let phone_number = validatePhoneNumber();

                        if(lastname && firstname && PIN && specialty && email && phone_number) 
                        {
                            addDoctor();
                        }
                    }} className="save-button">Înregistrare</button>
                    <button onClick={() => {reset()}} className="reset-button">Resetare</button>
                    <button onClick={() => {setOpenDialog(true)}} className="cancel-button">Renunță</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateDoctor