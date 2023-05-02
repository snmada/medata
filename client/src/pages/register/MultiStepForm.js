import React, {useState} from 'react'
import "../register/Register.scss"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHospital, faUser, faLock, faCircleCheck, faCircleDot} from '@fortawesome/free-solid-svg-icons'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import SuccessPage from './SuccessPage'
import logo from './../../logo/logo.svg'

function MultiStepForm() {

    const root = document.documentElement;
    const [page, setPage] = useState(0);

    const [data, setData] = useState({
        TIN: "",                                   
        firstname: "",
        lastname: "",
        PIN: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const nextPage = () =>{
        setPage(page + 1);
    }

    const prevPage = () =>{
        setPage(page - 1);
    }
    
    function displayPage() {
        if(page === 0)
        {
            return <StepOne data={data} setData={setData} nextPage={nextPage}/>;
        } 
        else if(page === 1)
        {
            return <StepTwo data={data} setData={setData} prevPage={prevPage} nextPage={nextPage}/>;
        } 
        else if(page === 2)
        {
            return <StepThree data={data} setData={setData} prevPage={prevPage} nextPage={nextPage}/>;
        }
    }

    return (
        <div className="register">
            <div className="container">
                <div className="inner-container">
                    <div className="form-container">
                        <div className="logo">
                            <a href="/"><img src={logo} width="160" height="45"/></a>
                        </div> 
                        {page <= 2?
                        (
                            <>
                                <div className="title">Înregistrare</div>
                                <div className={page < 1? "req":"req active"}>Vă rugăm să parcurgeți următorii pași.</div>
                                <div className="progress-bar">
                                    <ul>
                                        <li>
                                            <FontAwesomeIcon icon={faHospital} className="icon"/><br></br>
                                            {page >= 1 ? <FontAwesomeIcon icon={faCircleCheck} className="icon-check"/> : <FontAwesomeIcon icon={faCircleDot} className="icon-dot"/> }
                                            {root.style.setProperty('--background-color-first', page >= 1? '#409779':'#D1D1D1')}
                
                                        </li>
                                        <li>
                                            <FontAwesomeIcon icon={faUser} className="icon"/><br></br>
                                            {page >= 2 ? <FontAwesomeIcon icon={faCircleCheck} className="icon-check"/> : <FontAwesomeIcon icon={faCircleDot} className="icon-dot"/> }
                                            {root.style.setProperty('--background-color-second', page >= 2? '#409779':'#D1D1D1')}
                                        </li>
                                        <li>
                                            <FontAwesomeIcon icon={faLock} className="icon"/><br></br>
                                            {page == 3 ? <FontAwesomeIcon icon={faCircleCheck} className="icon-check"/> : <FontAwesomeIcon icon={faCircleDot} className="icon-dot"/> }
                                        </li>
                                    </ul>
                                </div>
                                <div className="form">
                                    {root.style.setProperty('--padding-top', page === 0? '25%':'10%')}
                                    <div className="body">
                                        {displayPage()}
                                    </div>
                                </div>
                            </>
                        )
                        :
                        (
                            <div className="success-container">
                                <SuccessPage/>
                            </div>
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}


export default MultiStepForm