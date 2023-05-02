import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUserDoctor, faUserNurse, faGear} from '@fortawesome/free-solid-svg-icons'

export const SidebarData = [
    {
        icon: <FontAwesomeIcon icon={faUserDoctor}/>,
        title: "MEDICI",
        link: "/profile/doctors"
    },
    {
        icon: <FontAwesomeIcon icon={faUserNurse}/>,
        title: "RECEPȚIONERI MEDICALI",
        link: "/profile/scheduler"
    },
    {
        icon: <FontAwesomeIcon icon={faGear}/>,
        title: "SETĂRI",
        link: "/profile/settings"
    }
]