import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCalendarDays, faUsers} from '@fortawesome/free-solid-svg-icons'

export const SidebarData = [
    {
        icon: <FontAwesomeIcon icon={faCalendarDays}/>,
        title: "PROGRAMĂRI",
        link: "/profile/appointments"
    },
    {
        icon: <FontAwesomeIcon icon={faUsers}/>,
        title: "PACIENȚI",
        link: "/profile/patients"
    }
]