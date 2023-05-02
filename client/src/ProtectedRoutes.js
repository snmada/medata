import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Admin from './pages/profile/admin/Admin'
import Doctor from './pages/profile/doctor/Doctor'
import Scheduler from './pages/profile/scheduler/Scheduler'

function ProtectedRoutes() {

    let navigate = useNavigate();
    
    useEffect(() => {
        if (sessionStorage.getItem("role") === null)
        {
            navigate("/")   
        }
    },[])

  return (
      <>
      {(sessionStorage.getItem("role") == "admin") && <Admin/>}
      {(sessionStorage.getItem("role") == "doctor") && <Doctor/>}
      {(sessionStorage.getItem("role") == "scheduler") && <Scheduler/>}
      </>
  )
}

export default ProtectedRoutes