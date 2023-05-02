import React, {useState, useEffect} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye, faMagnifyingGlass, faTrash, faTriangleExclamation} from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios'
import {useNavigate} from 'react-router-dom'
import ConfirmDialog from "../../../../../components/confirm-dialog/ConfirmDialog"
import AlertMessage from "../../../../../components/alert-message/AlertMessage"
import "../list-patients/ListPatients.scss"

function ListPatients() {

    const navigate = useNavigate();

    const [patientList, setPatientList] = useState([{}]);
    const [openDialog, setOpenDialog] = useState(false);
    const [close, setClose] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [id_patient, setIdPatient] = useState("");
    const [searchPIN, setSearchPIN] = useState("");
    const [PIN, setPIN] = useState("");

    useEffect(() => {
        getPatient();
    }, []);

    function getPatient() {
        Axios.post('http://localhost:3001/get-patient',{
            id_doctor: sessionStorage.getItem("UID")
        }).then((response) => {
            setPatientList(response.data);
        })
    }

    function deletePatient(id) {
        Axios.delete(`http://localhost:3001/delete-patient/${id}`).then((response) => {
            if(response.data.error === undefined)
            {
                setPatientList(
                    patientList.filter((val) => {
                        return val.id_patient !== id;
                    })
                );
                setClose(false);
                setAlertMessage({
                    message: "Ștergerea s-a realizat cu succes!", 
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

    function displayAlertMessage() {
        if(close === false)
        {
            return <AlertMessage setClose={setClose} alertMessage={alertMessage}/>
        }
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
                deletePatient(id_patient);
                setConfirm(false);
            }
        }
    }

    const dataWarning = ({
        icon: <FontAwesomeIcon icon={faTriangleExclamation} className="icon"/>,
        text: `Sunteți sigur că doriți să ștergeți datele pacientului selectat având următorul CNP: ${PIN}? \r\n\r\n Acestea vor fi șterse definitiv!`,
        button: "Șterge" 
    })

  return (
        <div className="doctor">
            <div className="container-doctor">
                {displayConfirmDialog()}
                {displayAlertMessage()}
                <div className="list-patient">
                    <div className="header-container">
                        <div className="search-patient">
                            <input className="input"
                                type="text"
                                placeholder = "Căutare după CNP......"
                                onChange={event => {setSearchPIN(event.target.value)}}
                            />
                            <div className="icon"><FontAwesomeIcon icon={faMagnifyingGlass} className="icon"/></div>
                        </div>
                    </div>
                    <div className="table-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nume</th>
                                    <th>Prenume</th>
                                    <th>CNP</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {patientList.filter((val) => {
                                    if(searchPIN == "")
                                    {
                                        return val;
                                    }
                                    else if((val.PIN + "").startsWith(searchPIN))
                                    {
                                        return val;
                                    }
                                }).sort(function(a, b){
                                    if(a.lastname > b.lastname) return 1;
                                    if(a.lastname < b.lastname) return -1;
        
                                    if(a.firstname > b.firstname) return 1;
                                    if(a.firstname < b.firstname) return -1;
        
                                }).map((val, index, key) => {
                                    if(key[index].id_patient !== undefined)
                                    {
                                        return(
                                            <tr>
                                                <td>{val.id_patient}</td>
                                                <td>{val.lastname}</td>
                                                <td>{val.firstname}</td>
                                                <td>{val.PIN}</td>
                                                <td>
                                                    <FontAwesomeIcon icon={faEye} className="icon-eye" data-item={val}
                                                    onClick={() => {
                                                        sessionStorage.setItem("id", val.id_patient);
                                                        navigate("/profile/patients/medical-record");
                        
                                                    }}/>
                                                </td>
                                                <td>
                                                    <FontAwesomeIcon icon={faTrash} className="icon-trash" data-item={val}
                                                        onClick={() => {
                                                            setPIN(val.PIN);
                                                            setIdPatient(val.id_patient)
                                                            setOpenDialog(true);
                                                        }}/>
                                                </td>
                                            </tr>
                                        )
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListPatients