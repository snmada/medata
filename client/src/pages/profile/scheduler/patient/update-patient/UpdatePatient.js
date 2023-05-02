import React, {useEffect, useState} from 'react'
import "../update-patient/UpdatePatient.scss"
import Axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTriangleExclamation, faCircleExclamation} from '@fortawesome/free-solid-svg-icons'
import ConfirmDialog from '../../../../../components/confirm-dialog/ConfirmDialog'
import AlertMessage from '../../../../../components/alert-message/AlertMessage'
import validator from 'validator'
import {useNavigate, useParams} from 'react-router-dom'

function UpdatePatient() {

    const navigate = useNavigate();
    const param = useParams();

    const [openDialog, setOpenDialog] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [close, setClose] = useState(true);
    const [errorLastname, setErrorLastname] = useState(false);
    const [errorFirstname, setErrorFirstname] = useState(false);
    const [errorPIN, setErrorPIN] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorAddress, setErrorAddress] = useState(false);
    const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);

    const [patient, setPatient] = useState([{}]);

    const [alertMessage, setAlertMessage] = useState({
        message: "",
        type: ""
    });

    const dataWarning = ({
        icon: <FontAwesomeIcon icon={faTriangleExclamation} className="icon"/>,
        text: "Sunteți sigur că doriți să renunțați? \r\n Dacă ați introdus noi date acestea nu vor fi salvate.",
        button: "Renunțare" 
    })

    useEffect(()=>{
        getPatient();
    }, [])

    
    function validateLastname() {
        if((/^[a-zăâîșțĂÂÎȘȚ -]+$/i.test(patient.lastname.trim())))
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
        if((/^[a-zA-ZăâîșțĂÂÎȘȚ -]+$/i.test(patient.firstname.trim())))
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
        if(/^[1-9]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[1-4]\d|5[0-2]|99)(00[1-9]|0[1-9]\d|[1-9]\d\d)\d$/g.test(patient.PIN))
        {
            setErrorPIN(false);
            return 1;
        }
        else
        {
            setErrorPIN(true);
            return 0;
        }
    }

    function validateEmail() {
        if(patient.email == null || patient.email.trim().length === 0)
        {
            setErrorEmail(false);
            return 1;
        }
        else
        {
            if(validator.isEmail(patient.email))
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
    }

    function validateAddress() {
        if(patient.address == null || patient.address.length === 0)
        {
            setErrorAddress(false);
            return 1;
        }
        else if(patient.address.length !== 0  && (/^\s*$/.test(patient.address)))
        {
            setErrorAddress(true);
            return 0;
        }
        else
        {
            setErrorAddress(false);
            return 1;
        }
    }

    function validatePhoneNumber() {
        if(patient.phone_number.length == 10 && (/^[0-9]+$/i.test(patient.phone_number)))
        {
            setErrorPhoneNumber(false);
            return 1;
        }
        else
        {
            setErrorPhoneNumber(true);
            return 0;
        }
    }

    function getPatient() {
        Axios.post('http://localhost:3001/get-patient-data', {
            idPatient: param.id
        }).then((response) => {
            setPatient(response.data);
        })
    }

    function capitalizeFirstLetter(name) {
        let aux = [];
        name.split(/[ -]+/).forEach(element => {
            aux.push(element.charAt(0).toUpperCase() + element.slice(1).toLowerCase() + "")
        });
        return aux.join(' ');
    }

    function updatePatient(id) {
        Axios.put('http://localhost:3001/update-patient',{
            idPatient: id,
            lastname: capitalizeFirstLetter(patient.lastname.trim()),
            firstname: capitalizeFirstLetter(patient.firstname.trim()),
            PIN: patient.PIN,
            address: patient.address,
            phoneNumber: patient.phone_number,
            email: patient.email,
        }).then((response) => {
            if(response.data.err === undefined)
            {
                setClose(false);
                setAlertMessage({
                    message: "Editarea s-a realizat cu succes!", 
                    type: "success"
                });
            }
            else
            {
                setClose(false);
                setAlertMessage({
                    message: "A intervenit o eroare!", 
                    type: "error"
                });
            }
        }).catch(() => {
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
            return <ConfirmDialog setOpenDialog = {setOpenDialog} setConfirm = {setConfirm} dataWarning = {dataWarning}/>
        }
        else
        {
            if(confirm == true)
            {
                navigate('/profile/list-patients');
            }
        }
    }

    function displayAlertMessage() {
        if(close === false)
        {
            return <AlertMessage setClose = {setClose} alertMessage = {alertMessage}/>
        }
    }

  return (
        <div className="scheduler">
            <div className="container-scheduler">
                {displayConfirmDialog()}
                {displayAlertMessage()}
                <div className="update-patient-info">
                    <div className="update-title">Editare date pacient</div>
                    <div className="update-info">
                        <div className="first-container-update-info">
                            <div className="input-container">
                                <input className="input"
                                    type="text"
                                    required
                                    value={patient.lastname}
                                    onChange={(event) => setPatient({...patient, lastname: event.target.value})}
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
                                    value={patient.firstname}
                                    onChange={(event) => setPatient({...patient, firstname: event.target.value})}
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
                                    value={patient.PIN}
                                    onChange={(event) => setPatient({...patient, PIN: event.target.value.trim()})}
                                />
                                <br></br>
                                <label className="label">CNP</label>
                                <div className={errorPIN? "error-icon" : "error-icon active"}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                                <div className={errorPIN? "error-message" : "error-message active"}><p>Introduceți un CNP valid!</p></div>
                            </div>
                        </div>
                        <div className="second-container-update-info">
                            <div className="input-container">
                                <input className="input"
                                    type="text"
                                    required
                                    value={patient.address == null? '' : patient.address}
                                    onChange={(event) => setPatient({...patient, address: event.target.value})}
                                />
                                <br></br>
                                <label className="label">Adresă</label>
                                <div className={errorAddress? "error-icon" : "error-icon active"}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                                <div className={errorAddress? "error-message" : "error-message active"}><p>Introduceți o adresă validă!</p></div>
                            </div>
                            <div className="input-container">
                                <input className="input"
                                    type="text"
                                    required
                                    value={patient.email == null? '' : patient.email}
                                    onChange={(event) => setPatient({...patient, email: event.target.value.trim()})}
                                />
                                <br></br>
                                <label className="label">Email</label>
                                <div className={errorEmail? "error-icon" : "error-icon active"}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                                <div className={errorEmail? "error-message" : "error-message active"}><p>Introduceți un email valid!</p></div>
                            </div>
                            <div className="input-container">
                                <input className="input"
                                    type="text"
                                    required
                                    value={patient.phone_number}
                                    onChange={(event) => setPatient({...patient, phone_number: event.target.value.trim()})}
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
                            let email = validateEmail();
                            let address = validateAddress();
                            let phone_number = validatePhoneNumber();
                            
                            if(lastname && firstname && PIN && email && address && phone_number)
                            {
                                updatePatient(patient.id_patient);
                            }
                        }} className="save-button">Salvează</button>
                        <button onClick={() => {setOpenDialog(true)}} className="cancel-button">Renunță</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdatePatient