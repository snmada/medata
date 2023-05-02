import React, {useState, useEffect} from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import "./CreateAppointment.scss"
import  Axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMagnifyingGlass, faCircleExclamation} from '@fortawesome/free-solid-svg-icons'
import AlertMessage from '../../../../../components/alert-message/AlertMessage'

function CreateAppointment() {

    const [doctors, setDoctorList] = useState([{}]);
    const [hours, setHours] = useState([{}]);
    
    const [searchDoctor, setSearchDoctor] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [idDoctor, setIdDoctor] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [date, setDate] = useState(null);
    const [day, setDay] = useState("");

    const [selectedHour, setSelectedHour] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const [errorLastname, setErrorLastname] = useState(false);
    const [errorFirstname, setErrorFirstname] = useState(false);
    const [errorPIN, setErrorPIN] = useState(false);
    const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);

    const [alertMessage, setAlertMessage] = useState("");
    const [close, setClose] = useState(true);

    const [data, setData] = useState({ 
        idScheduler: "",
        idDoctor: "", 
        date: "",
        time: "",
        firstname: "",                                
        lastname: "",
        PIN: "",
        phoneNumber: "",
    })

    function onDateChange(date) {
        setDate(date);
        setDay((date.getDay()).toString());
    }

    useEffect(() => {
        getDoctorList();
    }, [])

    useEffect(() => {
        if(idDoctor === "" || selectedDate === "" || selectedHour === "")
        {
            setDisabled(true);
        }
        else
        {
            setDisabled(false);
        }
    }, [idDoctor, selectedDate, selectedHour])

    useEffect(() => {
        if(date)
        {
            if(idDoctor && date.getDay())
            {
                getAvailableHours();
            }

            if(date.getDate() < 10)
            {
                if((date.getMonth() + 1) < 10)
                {
                    setSelectedDate("0" + date.getDate() + ".0" + (date.getMonth()+1) + "." + date.getFullYear());
                }
                else
                {
                    setSelectedDate("0" + date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear());
                }
            }
            else
            {
                if((date.getMonth() + 1) < 10)
                {
                    setSelectedDate(date.getDate() + ".0" + (date.getMonth() + 1) + "." + date.getFullYear());
                }
                else
                {
                    setSelectedDate(date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear());
                }
            }
        }
    }, [date])

    function getDoctorList () {
        Axios.post("http://localhost:3001/read-doctor",{
            id_TIN: sessionStorage.getItem("id_TIN")
        }).then((response) => {
            setDoctorList(response.data);
        })
    }

    function getAvailableHours() {
        Axios.post('http://localhost:3001/get-available-hours',{
            idDoctor: idDoctor,
            date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
            day: day
        }).then((response) =>{
            setHours(response.data);
        });
    };

    function validateLastname() {
        if((/[a-zăâîșțĂÂÎȘȚ -]+/i.test(data.lastname.trim())))
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
        if((/[a-zăâîșțĂÂÎȘȚ -]+/i.test(data.firstname.trim())))
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

    function validatePhoneNumber() {
        if(data.phoneNumber.length == 10 && (/^[0-9]+$/i.test(data.phoneNumber)) )
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

    function displayAlertMessage() {
        if(close === false)
        {
            return <AlertMessage setClose = {setClose} alertMessage = {alertMessage}/>
        }
    }

    function getGender(PIN) {
        if(PIN.substring(0,1) == "1" || PIN.substring(0,1) == "5" || PIN.substring(0,1) == "7")
        {
            return "M"
        }
        if(PIN.substring(0,1) == "2" || PIN.substring(0,1) == "6" || PIN.substring(0,1) == "8")
        {
            return "F"
        }
    }

    function getAge(PIN) {

        let year, month, day, month_difference, full_year, age;

        if(PIN.substring(0,1) === "1" || PIN.substring(0,1) === "2")
        {
            year = parseInt("19" + PIN.substring(1,3));
        }
        if(PIN.substring(0,1) === "5" || PIN.substring(0,1) === "6")
        {
            year = parseInt("20" + PIN.substring(1,3));
        }

        month = PIN.substring(3, 5);
        day = PIN.substring(5, 7);

        month_difference = Date.now() - new Date(month + "/" + day + "/" + year).getTime();
        full_year = new Date(month_difference).getUTCFullYear();

        age = Math.abs(full_year - 1970);

        return age;
    }

    function capitalizeFirstLetter(name) {
        let aux = [];
        name.split(/[ -]+/).forEach(element => {
            aux.push(element.charAt(0).toUpperCase() + element.slice(1).toLowerCase() + "")
        });
        return aux.join(' ');
    }

    function createAppointment() {
        Axios.post('http://localhost:3001/create-appointment',{
            idScheduler: sessionStorage.getItem("UID"),
            idDoctor: idDoctor, 
            idTIN: sessionStorage.getItem("id_TIN"),
            date: selectedDate.trim(),
            hour: selectedHour.trim(),
            gender: getGender(data.PIN),
            age: getAge(data.PIN),
            firstname: capitalizeFirstLetter(data.firstname.trim()),
            lastname: capitalizeFirstLetter(data.lastname.trim()),
            PIN: data.PIN,
            phoneNumber: data.phoneNumber
        }).then((response) => {
            if(response.data.error === undefined)
            {
                setClose(false);
                setAlertMessage({
                    message: "Datele au fost salvate cu succes!", 
                    type: "success"
                });
                setDisabled(true);
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

    function reset() {
        window.location.reload();
    }

  return (
        <div className="scheduler">
            <div className="container-scheduler">
                {displayAlertMessage()}
                <div className="doctor-list">
                    <div className="search-doctor">
                        <input className="input"
                            type = "text"
                            placeholder = "Căutare...."
                            onChange={event => {setSearchDoctor(event.target.value)}}
                        />
                        <div className="icon"><FontAwesomeIcon icon = {faMagnifyingGlass} className="icon"/></div>
                    </div>
                    <div className="list">
                        { 
                            doctors.filter((value) => {
                                if(searchDoctor == "")
                                {
                                    return value;
                                }
                                else if((value.lastname.trim() + " " + value.firstname.trim()).toLowerCase().startsWith(searchDoctor.toLowerCase()))
                                {
                                    return value;
                                }
                            }).sort(function(a, b){
                                if(a.lastname > b.lastname) return 1;
                                if(a.lastname < b.lastname) return -1;
                                if(a.firstname > b.firstname) return 1;
                                if(a.firstname < b.firstname) return -1;
                            }).map((value) => {
                                return(
                                    <div className="doctor-name" onClick={() => {
                                        setIdDoctor(value.id_doctor);
                                        setDoctorName(value.lastname + " " + value.firstname);
                                        setDate(new Date());
                                        setDay((new Date().getDay()).toString());
                                    }}>{value.lastname} {value.firstname}</div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="calendar">
                    <div className="calendar-container">
                        <Calendar onChange = {onDateChange} date = {date}/>  
                    </div>
                    <div className="hour-available">
                        {
                            hours.sort(function(a, b){
                                if(a.hour > b.hour) return 1;
                                if(a.hour < b.hour) return -1;
                            }).map((value, index, key) => {
                                if(key[index].id_schedule !== undefined){
                                    return(
                                        <div className="hour" onClick={() =>{
                                            setSelectedHour(value.hour)
                                        }}> {value.hour} </div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
                
                <div className="appointment">
                    <div className="selected-data">Medic: {doctorName} <br></br> Data: {selectedDate} <br></br> Ora: {selectedHour}</div>
                    <div  className="input-container">
                        <input className="input"
                            type="text"
                            required
                            value={data.lastname}
                            onChange={(event) => setData({...data, lastname: event.target.value})}
                        />
                        <label className="label">Nume</label>
                        <div className={errorLastname? "error-icon" : "error-icon active"}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                        <div className={errorLastname? "error-message" : "error-message active"}><p>Introduceți un nume valid!</p></div>
                    </div>
                    <div  className="input-container">
                        <input className="input"
                            type="text"
                            required
                            value={data.firstname}
                            onChange={(event) => setData({...data, firstname: event.target.value})}
                        />
                        <label className="label">Prenume</label>
                        <div className={errorFirstname? "error-icon" : "error-icon active"}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                        <div className={errorFirstname? "error-message" : "error-message active"}><p>Introduceți un prenume valid!</p></div>
                    </div>
                    <div  className="input-container">
                        <input className="input"
                            type="text"
                            required
                            value={data.PIN}
                            onChange={(event) => setData({...data, PIN: event.target.value.trim()})}
                        />
                        <label className="label">CNP (Cod numeric personal)</label>
                        <div className={errorPIN? "error-icon" : "error-icon active"}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                        <div className={errorPIN? "error-message" : "error-message active"}><p>Introduceți un CNP valid!</p></div>
                    </div>
                    <div  className="input-container">
                        <input className="input"
                            type="text"
                            required
                            value={data.phoneNumber}
                            onChange={(event) => setData({...data, phoneNumber: event.target.value.trim()})}
                        />
                        <label className="label">Telefon</label>
                        <div className={errorPhoneNumber? "error-icon" : "error-icon active"}><FontAwesomeIcon icon={faCircleExclamation} className="icon"/></div>
                        <div className={errorPhoneNumber? "error-message" : "error-message active"}><p>Introduceți un număr valid!</p></div>
                    </div>

                    <div className="button">
                        <button className="button-cancel" onClick={() => {reset()}}>Resetare</button>
                        <button className={disabled? "button-save disabled" : "button-save"} onClick={() => {
                            if(!disabled)
                            {
                                let lastname = validateLastname();
                                let firstname = validateFirstname();
                                let PIN = validatePIN();
                                let phoneNumber = validatePhoneNumber();
            
                                if(lastname && firstname && PIN && phoneNumber  && idDoctor !== "" && selectedDate !== "" && selectedHour !== "")
                                {
                                    createAppointment();
                                }
                            }
                        }}>Salvare</button>
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default CreateAppointment