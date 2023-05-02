import React, {useState, useEffect} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faMagnifyingGlass, faTrash, faTriangleExclamation} from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios'
import {useNavigate} from 'react-router-dom'
import ConfirmDialog from "../../../../../components/confirm-dialog/ConfirmDialog"
import AlertMessage from "../../../../../components/alert-message/AlertMessage"

function ListPatients() {

    const navigate = useNavigate();

    const [patients, setPatients] = useState([{}]);
    const [openDialog, setOpenDialog] = useState(false);
    const [close, setClose] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [idPatient, setIdPatient] = useState("");
    const [searchPIN, setSearchPIN] = useState("");
    const [PIN, setPIN] = useState("");

    const dataWarning = ({
        icon: <FontAwesomeIcon icon={faTriangleExclamation} className="icon"/>,
        text: `Sunteți sigur că doriți să ștergeți datele pacientului selectat având următorul CNP: ${PIN}? \r\n\r\n Acestea vor fi șterse definitiv!`,
        button: "Șterge" 
    })

    useEffect(() => {
        getPatients();
    }, []);

    function getPatients() {
        Axios.post('http://localhost:3001/get-patients',{
            id_TIN: sessionStorage.getItem("id_TIN")
        }).then((response) => {
            setPatients(response.data);
        })
    }

    function deletePatient(id) {
        Axios.delete(`http://localhost:3001/delete-patient/${id}`).then((response) => {
            if(response.data.err === undefined)
            {
                setPatients(
                    patients.filter((val) => {
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
            return <AlertMessage setClose = {setClose} alertMessage = {alertMessage}/>
        }
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
                deletePatient(idPatient);
                setConfirm(false);
            }
        }
    }

  return (
        <div className="scheduler">
            <div className="container-scheduler">
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
                                {
                                    patients.filter((value) => {
                                        if(searchPIN == "")
                                        {
                                            return value;
                                        }
                                        else if((value.PIN + "").startsWith(searchPIN))
                                        {
                                            return value;
                                        }
                                    }).sort(function(a, b){
                                        if(a.lastname > b.lastname) return 1;
                                        if(a.lastname < b.lastname) return -1;

                                        if(a.firstname > b.firstname) return 1;
                                        if(a.firstname < b.firstname) return -1;

                                    }).map((value, index, key) => {
                                        if(key[index].id_patient !== undefined)
                                        {
                                            return(
                                                <tr>
                                                    <td>{value.id_patient}</td>
                                                    <td>{value.lastname}</td>
                                                    <td>{value.firstname}</td>
                                                    <td>{value.PIN}</td>
                                                    <td>
                                                        <FontAwesomeIcon icon = {faPen} className="icon-pen" data-item={value}
                                                        onClick={() => {
                                                            navigate(`/profile/list-patients/update/${value.id_patient}`);
                                                        }}/>
                                                    </td>
                                                    <td>
                                                        <FontAwesomeIcon icon = {faTrash} className="icon-trash" data-item={value}
                                                        onClick={() => {
                                                            setIdPatient(value.id_patient)
                                                            setOpenDialog(true);
                                                            setPIN(value.PIN);
                                                        }}/>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListPatients