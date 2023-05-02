import React, {useState, useEffect} from 'react'
import  Axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faTriangleExclamation, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import ConfirmDialog from "../../../../../components/confirm-dialog/ConfirmDialog"
import AlertMessage from "../../../../../components/alert-message/AlertMessage"
import "./DeleteAppointment.scss"

function DeleteAppointment() {

    const [appointments, setAppointments] = useState([{}]);
    const [openDialog, setOpenDialog] = useState(false);
    const [close, setClose] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [searchPIN, setSearchPIN] = useState("");
    const [idAppointment, setIdAppointment] = useState("");
    const [date, setDate] = useState("");
    const [hour, setHour] = useState("");
    const [PIN, setPIN] = useState("");

    const dataWarning = ({
        icon: <FontAwesomeIcon icon={faTriangleExclamation} className="icon"/>,
        text: `Sunteți sigur că doriți să ștergeți programarea pacientului CNP: ${PIN} din data de ${date}, ora ${hour}?`,
        button: "Șterge" 
    });

    useEffect(() => {
        getAppointments();
    }, []);

    function getAppointments() {
        Axios.post('http://localhost:3001/get-appointments', {
            id_scheduler: sessionStorage.getItem("UID")
        }).then((response) => {
            var arr1 = response.data.appointment;
            var arr2 =response.data.patient;
            var aux = [{}];
            arr1.map((val) => {
                arr2.map((value) => {
                    if(val.id_patient === value.id_patient)
                    {
                        aux.push({
                            idAppointment: val.id_appointment,
                            idPatient: value.id_patient,
                            date: val.date,
                            hour: val.hour,
                            PIN: value.PIN,
                            firstname: value.firstname,
                            lastname: value.lastname,
                            address: value.address,
                            phoneNumber: value.phone_number,
                            email: value.email
                        })
                    }
                })
            })
            setAppointments(aux);
        })
    }

    function deleteAppointment(id) {
        Axios.delete(`http://localhost:3001/delete-appointment/${id}`).then((response) => {
            if(response.data.error === undefined)
            {
                setAppointments(
                    appointments.filter((val) => {
                        return val.idAppointment !== id;
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
                deleteAppointment(idAppointment);
                setConfirm(false);
            }
        }
    }

    return (
        <div className="scheduler">
            <div className="container-scheduler">
                {displayConfirmDialog()}
                {displayAlertMessage()}
                <div className="list-appointment">
                    <div className="header-container">
                        <div className="search-doctor">
                            <input className="input"
                                type="text"
                                placeholder="Căutare după CNP......"
                                onChange={event => {setSearchPIN(event.target.value)}}
                            />
                            <div className="icon"><FontAwesomeIcon icon = {faMagnifyingGlass} className="icon"/></div>
                        </div>
                    </div>
                    <div className="table-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>CNP</th>
                                    <th>Data</th>
                                    <th>Ora</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    appointments.filter((value) => {
                                        if(searchPIN == "")
                                        {
                                            return value;
                                        }
                                        else if((value.PIN + "").startsWith(searchPIN))
                                        {
                                            return value;
                                        }
                                    }).map((value, index, key) => {
                                        if(key[index].idPatient !== undefined)
                                        {
                                            return(
                                                <tr>
                                                    <td>{value.idAppointment}</td>
                                                    <td>{value.PIN}</td>
                                                    <td>{value.date}</td>
                                                    <td>{value.hour}</td>
                                                    <td>
                                                        <FontAwesomeIcon icon = {faTrash} className="icon-trash" data-item = {value}
                                                        onClick={() => {
                                                            setIdAppointment(value.idAppointment);
                                                            setDate(value.date);
                                                            setHour(value.hour);
                                                            setPIN(value.PIN);
                                                            setOpenDialog(true);
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

export default DeleteAppointment