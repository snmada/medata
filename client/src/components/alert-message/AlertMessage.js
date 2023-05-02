import React, {useEffect} from 'react'
import "../alert-message/AlertMessage.scss"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheck, faXmark, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons'

function AlertMessage({setClose, alertMessage}) {

    useEffect(()=>{
        const time = setTimeout(() =>{
        setClose(true);
    }, 6000);

    return () =>{
        clearTimeout(time);
      }
    }, [])

  return (
      <>
        {alertMessage.type === "success"? 
          (
             <div className="alert-container-success">
              <div className="close">
                  <FontAwesomeIcon icon={faXmark} className="icon-xmark" onClick={() => {setClose(true)}}/>
              </div>
              <div className="alert-message">
                  <FontAwesomeIcon icon={faCheck} className="icon"/>  {alertMessage.message}
              </div>
            </div>
          )
          :
          (
            <div className="alert-container-error">
              <div className="close">
                  <FontAwesomeIcon icon={faXmark} className="icon-xmark" onClick={() => {setClose(true)}}/>
              </div>
              <div className="alert-message">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="icon"/>  {alertMessage.message}
              </div>
            </div>
          )
        }
      </>
  )
}

export default AlertMessage