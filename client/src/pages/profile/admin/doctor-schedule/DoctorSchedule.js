import React, {useState, useEffect} from 'react'
import "./DoctorSchedule.scss"
import Axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faTriangleExclamation} from '@fortawesome/free-solid-svg-icons'
import AlertMessage from '../../../../components/alert-message/AlertMessage'
import {useParams} from 'react-router-dom'
import ConfirmDialog from '../../../../components/confirm-dialog/ConfirmDialog'

function DoctorSchedule() {

    const param = useParams();

    const [openDialog, setOpenDialog] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [schedule, setSchedule] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [close, setClose] = useState(true);
    const [day, setDay] = useState();
    const [hour, setHour] = useState();
    const [dayName, setDayName] = useState(false);
    const [message, setMessage] = useState("");
    const [name, setName] = useState(false);
    const [data, setData] = useState({
        id: "",
        day: "",
        hour: ""
    });

    const dataWarning = ({
      icon: <FontAwesomeIcon icon={faTriangleExclamation} className="icon"/>,
      text: `Sunteți sigur că doriți să ștergeți ziua: ${data.day} și ora: ${data.hour} din programul de lucru?`,
      button: "Șterge" 
  })

    const daysName = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"];

    const days = [
        {day: "1", name: "Luni"},
        {day: "2", name: "Marți"},
        {day: "3", name: "Miercuri"},
        {day: "4", name: "Joi"},
        {day: "5", name: "Vineri"},
        {day: "6", name: "Sâmbătă"},
        {day: "7", name: "Duminică"},
    ]

    const hours = [
          {
            hour: "08:00"
          },
          {
            hour: "08:30"
          },
          {
            hour: "09:00"
          },
          {
            hour: "09:30"
          },
          {
            hour: "10:00"
          },
          {
            hour: "10:30"
          },
          {
            hour: "11:00"
          },
          {
            hour: "11:30"
          },
          {
            hour: "12:00"
          },
          {
            hour: "12:30"
          },
          {
            hour: "13:00"
          },
          {
            hour: "13:30"
          },
          {
            hour: "14:00"
          },
          {
            hour: "14:30"
          },
          {
            hour: "15:00"
          },
          {
            hour: "15:30"
          },
          {
            hour: "16:00"
          },
          {
            hour: "16:30"
          },
          {
            hour: "17:00"
          },
          {
            hour: "17:30"
          },
          {
            hour: "18:00"
          },
          {
            hour: "18:30"
          },
          {
            hour: "19:00"
          },
          {
            hour: "19:30"
          },
          {
            hour: "20:00"
          },
          {
            hour: "20:30"
          },
          {
            hour: "21:00"
          },
          {
            hour: "21:30"
          },
          {
            hour: "22:00"
          },
          {
            hour: "22:30"
          }
    ];

    useEffect(() => {
        getDoctorSchedule();
        getDoctorName();
    })

    function getDoctorSchedule() {
        Axios.post('http://localhost:3001/read-doctor-schedule',{
          id_doctor: param.id
        }).then((response) => {
            getSchedule(response.data);
        })
    }

    function getDoctorName() {
        Axios.post('http://localhost:3001/get-doctor-name',{
          id_doctor:param.id
        }).then((response) => {
          setName("Dr. " + response.data);
        })
    }

    function getSchedule(arr) {
        var aux = [{}];
        arr.map((val, index) => {
            aux.push(
                {
                    day: daysName[val.day - 1],
                    hour: val.hour,
                    day_number: val.day,
                    id: val.id_schedule
                }
            )
        })
        setSchedule(aux);
    }

    function addDoctorSchedule() {
        Axios.post('http://localhost:3001/add-doctor-schedule',{
            id_doctor: param.id,
            day: day,
            hour: hour
        }).then((response) => {
            if(response.data.message == 'success')
            {
              setClose(false);
              setAlertMessage({
                  message: "Datele au fost salvate in tabel", 
                  type: "success"
              });
              setDayName("");
              setHour("");
            }
            else if(response.data.error != undefined)
            {
              setClose(false);
              setAlertMessage({
                  message: "Selectati ziua si ora!", 
                  type: "error"
              });
            }
            else if(response.data.message == 'error')
            {
              setMessage("Ziua și ora selectată există deja în tabel! Selectați alte variante!");
            }
            else
            {
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

    function deleteRow(id) {
        Axios.delete(`http://localhost:3001/delete-doctor-schedule/${id}`).then((response) => {
          if(response.data.error === undefined)
          {
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
              deleteRow(data.id);
              setConfirm(false);
          }
      }
  }

  return (
    <div className="admin">
        <div className="admin-container">
            {displayAlertMessage()}
            {displayConfirmDialog()}
            <div className="doctor-schedule-container">
                <div className="doctor-schedule-add">
                    <div className="day-container">
                        <div className="day-title">Selectați ziua: </div>
                        <div className="day-list">
                            {
                                days.map((val, key) => {
                                    return(
                                        <div className="day" onClick={() => {setDay(val.day); setDayName(val.name); setMessage(""); }}>{val.name}</div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="hour-container">
                        <div className="hout-title">Selectați ora: </div>
                        <div className="hour-list">
                            {
                                hours.map((val, key) => {
                                    return(
                                        <div className="hour" onClick={() => {setHour(val.hour); setMessage(""); }}>{val.hour}</div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    Ziua selectată: {dayName}
                    <br></br>
                    Ora selectată: {hour}
                    <div className="button-container">
                        <button onClick={() => {
                          if(day !== "" && hour != "")
                          addDoctorSchedule()
                          }} className="save-button">Adaugă</button>
                    </div>
                </div>
                <div className="doctor-schedule">
                    <div className="title">Program de lucru {name}</div>
                    <div className="table-schedule">
                        <table>
                            <thead>
                                <th>Ziua</th>
                                <th>Ora</th>
                                <th></th>
                            </thead>
                            <tbody>
                                    {
                                        schedule.sort(function(a, b){
                                            if(a.day_number > b.day_number) return 1;
                                            if(a.day_number < b.day_number) return -1;

                                            if(a.hour > b.hour) return 1;
                                            if(a.hour < b.hour) return -1;

                                        }).map((val, index) => {
                                            if(index > 0)
                                            {
                                                return(
                                                    <tr>
                                                        <td>{val.day}</td>
                                                        <td>{val.hour}</td>
                                                        <td>
                                                        <FontAwesomeIcon icon={faTrash} className="icon-trash" data-item={val}
                                                            onClick={() => {
                                                                setData({
                                                                  id: val.id,
                                                                  day: val.day,
                                                                  hour: val.hour
                                                                })
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
                    <span>{message}</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DoctorSchedule