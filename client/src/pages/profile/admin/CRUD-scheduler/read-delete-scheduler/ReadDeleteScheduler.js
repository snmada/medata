import React, {useState, useEffect} from 'react'
import "../read-delete-scheduler/ReadDeleteScheduler.scss"
import  Axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPencil, faTrash, faPlus, faTriangleExclamation, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from 'react-router-dom'
import ConfirmDialog from '../../../../../components/confirm-dialog/ConfirmDialog'
import AlertMessage from '../../../../../components/alert-message/AlertMessage'

function ReadDeleteScheduler() {

    const navigate = useNavigate();

    const [schedulerList, setSchedulerList] = useState([{}]);
    const [openDialog, setOpenDialog] = useState(false);
    const [close, setClose] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [data, setData] = useState({
            id_scheduler: "",
            PIN: "",
    });

    const dataWarning = ({
        icon: <FontAwesomeIcon icon={faTriangleExclamation} className="icon"/>,
        text: `Sunteți sigur că doriți să ștergeți datele recepționerului selectat având următorul CNP: ${data.PIN}? \r\n\r\n Acestea vor fi șterse definitiv!`,
        button: "Șterge" 
    })

    useEffect(() => {
        getSchedulerList();
    }, []);

    function getSchedulerList() {
        Axios.post('http://localhost:3001/read-scheduler', {
            id_TIN: sessionStorage.getItem("id_TIN")
        }).then((response) => {
            setSchedulerList(response.data);
        })
    }

    function deleteScheduler(id) {
        Axios.delete(`http://localhost:3001/delete-scheduler/${id}`).then((response) => {
            if(response.data.error === undefined)
            {
                setSchedulerList(
                    schedulerList.filter((val) => {
                        return val.id_scheduler !== id;
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
                deleteScheduler(data.id_scheduler);
                setConfirm(false);
            }
        }
    }

  return (
    <div className="admin">
        <div className="admin-container">
            {displayConfirmDialog()}
            {displayAlertMessage()}
            <div className="header-container">
                <div className="search-scheduler">
                    <input className="input"
                        type="text"
                        placeholder = "Căutare după nume......"
                        onChange={event => {setSearchName(event.target.value)}}
                    />
                    <div className="icon"><FontAwesomeIcon icon={faMagnifyingGlass} className="icon"/></div>
                </div>
                <div className="button">
                    <div className="add-button" onClick={() => {
                        navigate("/profile/scheduler/add")
                    }}>
                        <FontAwesomeIcon icon={faPlus} className="icon"/>
                        <span>Adaugă recepționer medical</span>
                    </div>
                </div>
            </div>
            <div className="table-list">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>ID</th>
                            <th>Nume</th>
                            <th>Prenume</th>
                            <th>CNP</th>
                            <th>Telefon</th>
                            <th>E-mail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedulerList.filter((val) => {
                            if(searchName == "")
                            {
                                return val;
                            }
                            else if((val.lastname + " " + val.firstname).toLowerCase().startsWith(searchName.trim().toLowerCase()))
                            {
                                return val;
                            }
                        }).sort(function(a, b){
                            if(a.lastname > b.lastname) return 1;
                            if(a.lastname < b.lastname) return -1;

                            if(a.firstname > b.firstname) return 1;
                            if(a.firstname < b.firstname) return -1;

                        }).map((val, index, key) => {
                            if(key[index].id_scheduler !== undefined)
                            {
                                return(
                                    <tr>
                                        <td>
                                            <FontAwesomeIcon icon={faPencil} className="icon-pen" data-item={val}
                                            onClick={() => {
                                                navigate(`/profile/scheduler/update/${val.id_scheduler}`);
                                            }}/>
                                        </td>
                                        <td>
                                            <FontAwesomeIcon icon={faTrash} className="icon-trash" data-item={val}
                                            onClick={() => {
                                                setData({
                                                    id_scheduler: val.id_scheduler,
                                                    PIN: val.PIN,
                                                })
                                                setOpenDialog(true);
                                            }}/>
                                        </td>
                                        <td>{val.id_scheduler}</td>
                                        <td>{val.lastname}</td>
                                        <td>{val.firstname}</td>
                                        <td>{val.PIN}</td>
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

export default ReadDeleteScheduler