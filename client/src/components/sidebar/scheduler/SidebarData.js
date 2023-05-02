import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCalendarDays, faUsers, faCalendarPlus} from '@fortawesome/free-solid-svg-icons'

export const SidebarData = [
    {
        icon: <FontAwesomeIcon icon={faCalendarPlus}/>,
        title: "ADĂUGARE PROGRAMĂRI",
        link: "/profile/appointment-scheduler"
    },
    {
        icon: <FontAwesomeIcon icon={faCalendarDays}/>,
        title: "PROGRAMĂRI",
        //link: "/profile/patients"
        link: "/profile/appointments-patients"
    },
    {
        icon: <FontAwesomeIcon icon={faUsers}/>,
        title: "PACIENȚI",
        //link: "/profile/patients"
        link: "/profile/list-patients"
    }
]