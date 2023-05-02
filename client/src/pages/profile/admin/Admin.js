import React from 'react'
import "./Admin.scss"
import 'react-calendar/dist/Calendar.css'
import {Routes, Route} from 'react-router-dom'
import CreateDoctor from './CRUD-doctor/create-doctor/CreateDoctor'
import ReadDeleteDoctor from "./CRUD-doctor/read-delete-doctor/ReadDeleteDoctor"
import UpdateDoctor from './CRUD-doctor/update-doctor/UpdateDoctor'
import DoctorSchedule from './doctor-schedule/DoctorSchedule'
import ReadDeleteScheduler from "./CRUD-scheduler/read-delete-scheduler/ReadDeleteScheduler"
import CreateScheduler from "./CRUD-scheduler/create-scheduler/CreateScheduler"
import UpdateScheduler from './CRUD-scheduler/update-scheduler/UpdateScheduler'
import Settings from './settings/Settings'

function Admin() {
  return (
        <div className="Admin">
            <Routes>
                <Route path="/doctors/add" exact element={<CreateDoctor/>}/>
                <Route path="/doctors" exact element={<ReadDeleteDoctor/>}/>
                <Route path="/doctors/update/:id" exact element={<UpdateDoctor/>}/>
                <Route path="/doctors/schedule/:id" exact element={<DoctorSchedule/>}/>
                <Route path="/scheduler/add" exact element={<CreateScheduler/>}/>
                <Route path="/scheduler" exact element={<ReadDeleteScheduler/>}/>
                <Route path="/scheduler/update/:id" exact element={<UpdateScheduler/>}/>
                <Route path="/settings" exact element={<Settings/>}/>
            </Routes> 
        </div>
    )
}

export default Admin