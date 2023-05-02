import React, {useState, useEffect} from 'react'
import "../read-delete-doctor/ReadDeleteDoctor.scss"
import  Axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPencil, faTrash, faPlus, faTriangleExclamation, faMagnifyingGlass, faCalendarDays} from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from 'react-router-dom'
import ConfirmDialog from '../../../../../components/confirm-dialog/ConfirmDialog'
import AlertMessage from '../../../../../components/alert-message/AlertMessage'

function ReadDeleteDoctor() {

    const navigate = useNavigate();

    const [doctorList, setDoctorList] = useState([{}]);
    const [openDialog, setOpenDialog] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [close, setClose] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");
    const [searchLastname, setSearchLastname] = useState("");

    const [data, setData] = useState({
        id_doctor: "",
        PIN: "",
    });

    const dataWarning = ({
        icon: <FontAwesomeIcon icon={faTriangleExclamation} className="icon"/>,
        text: `Sunteți sigur că doriți să ștergeți datele medicului selectat având următorul CNP: ${data.PIN}? \r\n\r\n Acestea vor fi șterse definitiv!`,
        button: "Șterge" 
    })

    useEffect(() => {
        getDoctorList();
    }, []);

    function getDoctorList() {
        Axios.post('http://localhost:3001/read-doctor', {
            id_TIN: sessionStorage.getItem("id_TIN")
        }).then((response) => {
            setDoctorList(response.data);
        })
    }
    
    function deleteDoctor(id) {
        Axios.delete(`http://localhost:3001/delete-doctor/${id}`).then((response) => {
            if(response.data.err === undefined)
            {
                setDoctorList(
                    doctorList.filter((val) => {
                        return val.id_doctor !== id;
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
                deleteDoctor(data.id_doctor);
                setConfirm(false);
            }
        }
    }

    
    return(
        <div className="admin">
            <div className="admin-container">
                {displayConfirmDialog()}
                {displayAlertMessage()}
                <div className="header-container">
                    <div className="search-doctor">
                        <input className="input"
                            type="text"
                            placeholder = "Căutare după nume......"
                            onChange={event => {setSearchLastname(event.target.value)}}
                        />
                        <div className="icon"><FontAwesomeIcon icon={faMagnifyingGlass} className="icon"/></div>
                    </div>
                    <div className="button">
                        <div className="add-button" onClick={() => {
                             navigate("/profile/doctors/add")
                        }}>
                            <FontAwesomeIcon icon={faPlus} className="icon"/>
                            <span>Adaugă medic</span>
                        </div>
                    </div>
                </div>
                <div className="table-list">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>ID</th>
                                <th>Nume</th>
                                <th>Prenume</th>
                                <th>CNP</th>
                                <th>Specialitate</th>
                                <th>Telefon</th>
                                <th>E-mail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctorList.filter((val) => {
                                if(searchLastname == "")
                                {
                                    return val;
                                }
                                else if((val.lastname + " " + val.firstname).toLowerCase().startsWith(searchLastname.toLowerCase().trim()))
                                {
                                    return val;
                                }
                            }).sort(function(a, b){
                                if(a.lastname > b.lastname) return 1;
                                if(a.lastname < b.lastname) return -1;

                                if(a.firstname > b.firstname) return 1;
                                if(a.firstname < b.firstname) return -1;

                            }).map((val, index, key) => {
                                if(key[index].id_doctor !== undefined)
                                {
                                    return(
                                        <tr>
                                            <td>
                                                <FontAwesomeIcon icon={faCalendarDays} className="icon-calendar" data-item={val}
                                                onClick={() => {
                                                    navigate(`/profile/doctors/schedule/${val.id_doctor}`);
                                                }}/>
                                            </td>
                                            <td>
                                                <FontAwesomeIcon icon={faPencil} className="icon-pen" data-item={val}
                                                onClick={() => {
                                                    navigate(`/profile/doctors/update/${val.id_doctor}`);
                                                }}/>
                                            </td>
                                            <td>
                                                <FontAwesomeIcon icon={faTrash} className="icon-trash" data-item={val}
                                                onClick={() => {
                                                    setData({
                                                        id_doctor: val.id_doctor,
                                                        PIN: val.PIN
                                                    })
                                                    setOpenDialog(true);
                                                }}/>
                                            </td>
                                            <td>{val.id_doctor}</td>
                                            <td>{val.lastname}</td>
                                            <td>{val.firstname}</td>
                                            <td>{val.PIN}</td>
                                            <td>{val.medical_specialty}</td>
                                            <td>{val.phone_number}</td>
                                            <td>{val.email}</td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>    
    )
}

export default ReadDeleteDoctor