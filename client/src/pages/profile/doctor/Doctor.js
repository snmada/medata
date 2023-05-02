import React from 'react'
import "../doctor/Doctor.scss"
import {Routes, Route} from 'react-router-dom'
import Appointments from "../doctor/appointments/Appointment"
import ListPatients from './patients/list-patients/ListPatients'
import Patient from './patients/patient/Patient'
import AddMedicalRecord from './patients/medical-record/AddMedicalRecord'

function Doctor() {
  return (
        <div className="doctor">
            <Routes>
                <Route path="/appointments" exact element={<Appointments/>}/>
                <Route path="/patients" exact element={<ListPatients/>}/>
                <Route path="/patients/medical-record" exact element={<Patient/>}/>
                <Route path="/patients/add-medical-record" exact element={<AddMedicalRecord/>}/>
            </Routes> 
        </div>
    )
}

export default Doctor