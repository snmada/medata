import React, {useState, useEffect} from 'react'
import "../update-scheduler/UpdateScheduler.scss"
import Axios from 'axios'
import {useParams, useNavigate} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTriangleExclamation, faCircleExclamation} from '@fortawesome/free-solid-svg-icons'
import AlertMessage from '../../../../../components/alert-message/AlertMessage'
import ConfirmDialog from '../../../../../components/confirm-dialog/ConfirmDialog'
import validator from 'validator'

function UpdateScheduler() {

    const param = useParams();
    const navigate = useNavigate();

    const [close, setClose] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [errorLastname, setErrorLastname] = useState(false);
    const [errorFirstname, setErrorFirstname] = useState(false);
    const [errorPIN, setErrorPIN] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);

    const [data, setData] = useState([{}]);

    const dataWarning = ({
        icon: <FontAwesomeIcon icon={faTriangleExclamation} className="icon"/>,
        text: "Sunteți sigur că doriți să renunțați? \r\n Dacă ați introdus noi date acestea nu vor fi salvate.",
        button: "Renunțare" 
    })

    useEffect(() => {
        getScheduler();
    }, [])

    function getScheduler() {
        Axios.post('http://localhost:3001/get-scheduler',{
            id_scheduler: param.id,
        }).then((response) => {
            setData(response.data);
        })
    }
    
    function validateLastname() {
        if((/[a-zăâîșțĂÂÎȘȚ .,'-]+/i.test(data.lastname)))
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
        if((/[a-zA-ZăâîșțĂÂÎȘȚ .,'-]+/i.test(data.firstname)))
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

    function validatePhoneNumber() {
        if(data.phone_number.length == 10 && (/[0-9]+/i.test(data.phone_number)) )
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
    
    function capitalizeFirstLetter(name) {
        let aux = [];
        name.split(/[ -]+/).forEach(element => {
            aux.push(element.charAt(0).toUpperCase() + element.slice(1).toLowerCase() + "")
        });
        return aux.join(' ');
    }

    function updateScheduler(id) {
        Axios.put('http://localhost:3001/update-scheduler',{
            id_scheduler: id,
            lastname: capitalizeFirstLetter(data.lastname.trim()),
            firstname: capitalizeFirstLetter(data.firstname.trim()),
            PIN: data.PIN,
            phone_number: data.phone_number,
            email: data.email,
        }).then((response) => {
            if(response.data.error === undefined)
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
            return <ConfirmDialog setOpenDialog = {setOpenDialog} setConfirm = {setConfirm} dataWarning = {dataWarning}/>
        }
        else
        {
            if(confirm == true)
            {
                navigate('/profile/scheduler');
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
    <div className="admin">
        <div className="admin-container">
            {displayConfirmDialog()}
            {displayAlertMessage()}
            <div className="update-container">
                <div className="title">Editare date recepționer medical</div>
                <div className="update-info">
                    <div className="first-container">
                        <div className="input-container">
                            <input className="input"
                                type="text"
                                required
                                defaultValue={data.lastname}
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
                                defaultValue={data.firstname}
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
                                defaultValue={data.PIN}
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
                                defaultValue={data.email}
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
                                defaultValue={data.phone_number}
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
                        let email = validateEmail();
                        let phone_number = validatePhoneNumber();

                        if(lastname && firstname && PIN && email && phone_number) 
                        {
                            updateScheduler(data.id_scheduler);
                        }
                    }} className="save-button">Salvează</button>
                    <button onClick={() => {setOpenDialog(true)}} className="cancel-button">Renunță</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UpdateScheduler