import React from 'react'
import "../scheduler/Scheduler.scss"
import AppointmentScheduler from "./appointment/create-appointment/CreateAppointment"
import {Routes, Route} from 'react-router-dom'
import DeleteAppointment from '../scheduler/appointment/delete-appointment/DeleteAppointment'
import UpdatePatient from '../scheduler/patient/update-patient/UpdatePatient'
import ListPatients from './patient/read-patient/ListPatients'

function Scheduler() {
  return (
        <div className="Scheduler">
            <Routes>
                <Route path="/appointment-scheduler" exact element={<AppointmentScheduler/>}/>
                <Route path="/list-patients" exact element={<ListPatients/>}/>
                <Route path="/appointments-patients" exact element={<DeleteAppointment/>}/>
                <Route path="/list-patients/update" exact element={<UpdatePatient/>}/>
                <Route path="/list-patients/update/:id" exact element={<UpdatePatient/>}/>
            </Routes>
        </div>
    )
}

export default Scheduler