import React, {useEffect, useState} from 'react'
import "../patient/Patient.scss"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye, faPlus, faTrash, faTriangleExclamation} from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios'
import {useNavigate} from 'react-router-dom'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import AlertMessage from '../../../../../components/alert-message/AlertMessage'
import ConfirmDialog from '../../../../../components/confirm-dialog/ConfirmDialog'

function Patient() {

    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = useState(false);
    const [close, setClose] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");
    const [confirm, setConfirm] = useState(false);

    const [idMedicalRecord, setIDMedicalRecord] = useState("");

    const [medList, setMedList] = useState([{}]);
    const [data, setData] = useState({                                 
        firstname: "",
        lastname: "",
        PIN: "",
        address: "",
        gender: "",
        age: "",
        phone_number: "",
        email: "",
    })

    const [doctorName, setDoctorName] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        getPatientInfo()
        getMedicalRecords()
        getDoctorInfo()
    }, [sessionStorage.getItem("id")]);

    function getPatientInfo() {
        Axios.post('http://localhost:3001/get-patient-info', {
            id_patient: sessionStorage.getItem("id")
        }).then((response) => {
            setInfo(response.data);
        })
    }

    function getDoctorInfo() {
        Axios.post('http://localhost:3001/get-doctor-name', {
            id_doctor: sessionStorage.getItem("UID")
        }).then((response) => {
            setDoctorName(response.data)
        })
    }

    function setInfo(arr) {
        arr.forEach(element => {
            setData({
                firstname: element.firstname,
                lastname: element.lastname,
                PIN: element.PIN,
                address: element.address,
                gender: element.gender,
                age: element.age,
                phone_number: element.phone_number,
                email: element.email,
            })
        });
    }

    function getMedicalRecords() {
        Axios.post('http://localhost:3001/get-medical-records', {
            id_patient: sessionStorage.getItem("id"),
            id_doctor: sessionStorage.getItem("UID")
        }).then((response) => {
            setMedList(response.data);
        })
    }

    function downloadPDF(date, examination, symptom, medical_history, primary_diagnosis, secondary_diagnosis, treatment, recommendation, conclusions, notes){
        const doc = new jsPDF({
            unit: "px",
            format: "A4"
        });
        
        autoTable(doc, {
            html: '#tabel-info',
            theme: 'plain',
            startY: 100,
            startX: 20,
            columnStyles: {
                0: {cellWidth: 60},
                1: {cellWidth: 100},
                2: {cellWidth: 60},
                3: {cellWidth: 155},
            },
            styles: {
                font: 'helvetica',
                cellWidth: 'wrap',
                fontSize: 11,
            }
        })
        
        autoTable(doc, {
            theme: "plain",
            columnStyles: {
                0: {cellWidth: 120},
                1: {cellWidth: 'auto'},
            },
            styles: {
                font: 'helvetica',
                cellWidth: 'wrap',
                fontSize: 11,
                minCellHeight: 25
            },
            body: [
                ['Examinare:', examination],
                ['Simptome:', symptom],
                ['Istoric:', medical_history],
                ['Diagnostic principal:', primary_diagnosis],
                ['Diagnostic secundar:', secondary_diagnosis],
                ['Tratament:', treatment],
                ['Recomandari:', recommendation],
                ['Concluzii:', conclusions],
                ['Observatii:', notes],
                ['', ''],
                ['', '']
            ]
          })

        autoTable(doc, {
            theme: "plain",
            columnStyles: {
                0: {cellWidth: 70},
                1: {cellWidth: 70},
                2: {cellWidth: 100},
                3: {cellWidth: 'auto', halign: 'center'},
            },
            styles: {
                font: 'helvetica',
                cellWidth: 'wrap',
                fontSize: 11,
            },
            body: [
                ['Data examinarii:', date, '', 'Semnatura si parafa medicului'],
                ['', '', '', doctorName],
            ]
          })

        doc.setFontSize(20);
        doc.text("Raport medical", 35, 60);
        doc.save(data.firstname + " " + data.lastname + " " + date);
    }

    function deleteRow(id) {
        Axios.delete(`http://localhost:3001/delete-medical-record/${id}`).then((response) => {
            if(response.data.err === undefined)
            {
                setMedList(
                    medList.filter((val) => {
                        return val.id_medical_record !== id;
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
                deleteRow(idMedicalRecord);
                setConfirm(false);
            }
        }
    }

    const dataWarning = ({
        icon: <FontAwesomeIcon icon={faTriangleExclamation} className="icon"/>,
        text: `Sunteți sigur că doriți să ștergeți raportul medical din data de ${date}?`,
        button: "Șterge" 
    })


    return (
        <div className="doctor">
            <div className="container-doctor">
            {displayAlertMessage()}
            {displayConfirmDialog()}
            <div className="patient-container">
                <div className="info-patient-container">
                    <div className="info-title">Date personale</div>
                    <table id="tabel-info" className="info">
                        <tbody>
                            <tr>
                                <td>Nume:</td>
                                <td>{data.lastname}</td>
                                <td>Varsta:</td>
                                <td>{data.age}</td>
                            </tr>
                            <tr>
                                <td>Prenume:</td>
                                <td>{data.firstname}</td>
                                <td>Adresa:</td>
                                <td>{data.address}</td>
                            </tr>
                            <tr>
                                <td>CNP:</td>
                                <td>{data.PIN}</td>
                                <td>Telefon:</td>
                                <td>{data.phone_number}</td>
                            </tr>
                            <tr>
                                <td>Sex:</td>
                                <td>{data.gender}</td>
                                <td>Email:</td>
                                <td>{data.email}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="first-container">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Nume</td>
                                    <td>{data.lastname}</td>
                                </tr>
                                <tr>
                                    <td>Prenume</td>
                                    <td>{data.firstname}</td>
                                </tr>
                                <tr>
                                    <td>CNP</td>
                                    <td>{data.PIN}</td>
                                </tr>
                                <tr>
                                    <td>Sex</td>
                                    <td>{data.gender}</td>
                                </tr>
                                <tr>
                                    <td>Vârsta</td>
                                    <td>{data.age}</td>
                                </tr>
                                <tr>
                                    <td>Adresa</td>
                                    <td>{data.address}</td>
                                </tr>
                                <tr>
                                    <td>Telefon</td>
                                    <td>{data.phone_number}</td>
                                </tr>
                                <tr>
                                    <td>E-mail</td>
                                    <td>{data.email}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="medical-records-container">
                    <div className="medical-records-title">
                        Rapoarte medicale
                        <button className="add" onClick={() => {navigate('/profile/patients/add-medical-record')}}> <FontAwesomeIcon icon={faPlus} className="icon"/> Adaugă raport nou</button>
                    </div>
                    <div className="table-medical-records">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID raport medical</th>
                                    <th>Examinare</th>
                                    <th>Data</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    medList.map((value) => {
                                        return(
                                            <tr>
                                                <td>{value.id_medical_record}</td>
                                                <td>{value.examination}</td>
                                                <td>{value.date}</td>
                                                <td><FontAwesomeIcon icon={faEye} className="icon-eye" onClick={()=>{
                                                    downloadPDF(value.date, value.examination, value.symptom, value.medical_history, value.primary_diagnosis, value.secondary_diagnosis, value.treatment, value.recommendation, value.conclusions, value.notes );
                                                }}/></td>
                                                <td><FontAwesomeIcon icon={faTrash} className="icon-trash" onClick={()=>{
                                                    setDate(value.date);
                                                    setIDMedicalRecord(value.id_medical_record);
                                                    setOpenDialog(true);
                                                }}/></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>  
  )
}

export default Patient