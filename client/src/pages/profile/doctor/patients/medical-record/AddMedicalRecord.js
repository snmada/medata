import React, {useState, useEffect} from 'react'
import "../medical-record/AddMedicalRecord.scss"
import Axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTriangleExclamation} from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from 'react-router-dom'
import AlertMessage from "../../../../../components/alert-message/AlertMessage"
import ConfirmDialog from '../../../../../components/confirm-dialog/ConfirmDialog'

function AddMedicalRecord() {

    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = useState(false);
    const [close, setClose] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [disabled, setDisabled] = useState()

    var today = new Date();
    today = today.getFullYear()+ '-' + (today.getMonth() + 1) + '-' + today.getDate();

    const [data, setData] = useState({                                 
        examination: "",
        symptom: "",
        medical_history: "",
        main_diagnosis: "",
        secondary_diagnosis: "",
        treatment: "",
        recommendation: "",
        conclusions: "",
        notes: ""
    })

    useEffect(() => {
        if(data.examination === "")
        {
            setDisabled(true);
        }
        else
        {
            setDisabled(false);
        }
    }, [data.examination]);

    function addMedicalRecord() {
        Axios.post('http://localhost:3001/add-medical-record', {
            id_patient: sessionStorage.getItem("id"),
            id_doctor: sessionStorage.getItem("UID"),
            date: today,
            examination: data.examination.trim(),
            symptom: data.symptom.trim(),
            medical_history: data.medical_history.trim(),
            main_diagnosis: data.main_diagnosis.trim(),
            secondary_diagnoses: data.secondary_diagnosis.trim(),
            treatment: data.treatment.trim(),
            recommendation: data.recommendation.trim(),
            conclusions: data.conclusions.trim(),
            notes: data.notes.trim()
        }).then((response) => {
            if(response.data.err === undefined)
            {
                setClose(false);
                setAlertMessage({
                    message: "Adăugarea s-a realizat cu succes!", 
                    type: "success"
                });
                setDisabled(true);
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

    function displayAlertMessage() {
        if(close === false)
        {
            return <AlertMessage setClose={setClose} alertMessage={alertMessage}/>
        }
    }

    const dataWarning = ({
        icon: <FontAwesomeIcon icon={faTriangleExclamation} className="icon"/>,
        text: "Sunteți sigur că doriți să anulați procesul de salvare a raportului medical?",
        button: "Da" 
    })

    function displayConfirmDialog() {
        if(openDialog == true)
        {
            return <ConfirmDialog setOpenDialog={setOpenDialog} setConfirm={setConfirm} dataWarning={dataWarning}/>
        }
        else
        {
            if(confirm == true)
            {
                navigate('/profile/patients/medical-record');
            }
        }
    }

    return (
        <div className="doctor">
            <div className="container-doctor">
                {displayAlertMessage()}
                {displayConfirmDialog()}
                <div className="medical-record-container">
                    <div className="title-med">Raport medical</div>
                    <div className="add-info">
                        <table>
                            <tr>
                                <td>Examinare</td>
                                <td>
                                    <textarea className="input" maxlength="500"
                                        type="text"
                                        required
                                        value={data.examination}
                                        onChange={(event) => setData({...data, examination: event.target.value})}
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>Simptome</td>
                                <td>
                                    <textarea className="input" maxlength="500"
                                        type="text"
                                        required
                                        value={data.symptom}
                                        onChange={(event) => setData({...data, symptom: event.target.value})}
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>Istoric medical</td>
                                <td>
                                    <textarea className="input" maxlength="600"
                                        type="text"
                                        required
                                        value={data.medical_history}
                                        onChange={(event) => setData({...data, medical_history: event.target.value})}
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>Diagnostic principal</td>
                                <td>
                                    <textarea className="input" maxlength="400"
                                        type="text"
                                        required
                                        value={data.main_diagnosis}
                                        onChange={(event) => setData({...data, main_diagnosis: event.target.value})}
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>Diagnostic secundar</td>
                                <td>
                                    <textarea className="input" maxlength="500"
                                        type="text"
                                        required
                                        value={data.secondary_diagnosis}
                                        onChange={(event) => setData({...data, secondary_diagnosis: event.target.value})}
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>Tratament</td>
                                <td>
                                    <textarea className="input" maxlength="600"
                                        type="text"
                                        required
                                        value={data.treatment}
                                        onChange={(event) => setData({...data, treatment: event.target.value})}
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>Recomandări</td>
                                <td>
                                    <textarea className="input" maxlength="600"
                                        type="text"
                                        required
                                        value={data.recommendation}
                                        onChange={(event) => setData({...data, recommendation: event.target.value})}
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>Concluzii</td>
                                <td>
                                    <textarea className="input" maxlength="600"
                                        type="text"
                                        required
                                        value={data.conclusions}
                                        onChange={(event) => setData({...data, conclusions: event.target.value})}
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>Observații</td>
                                <td>
                                    <textarea className="input" maxlength="600"
                                        type="text"
                                        required
                                        value={data.notes}
                                        onChange={(event) => setData({...data, notes: event.target.value})}
                                    ></textarea>
                                </td>
                            </tr>
                            
                        </table>
                    </div>
                    <div className="actions">
                        <button className="cancel" onClick={() => {setOpenDialog(true)}}>Anulează</button>
                        <button className={disabled? "button-save disabled" : "button-save"} onClick={() => { if(!disabled){addMedicalRecord()}}}>Salvează</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddMedicalRecord