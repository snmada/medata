import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheck, faXmark} from '@fortawesome/free-solid-svg-icons'

function SuccessPage() {

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 8000);
    }, []);

  return (
      <>
      {loading? 
      (
        <>
        <div className="text">Vă rugăm să așteptați câteva secunde</div>
        <div className="loader">
            <div className="f-dot"></div>
            <div className="s-dot"></div>
            <div className="t-dot"></div>
        </div>
        </>
      )
      :
      (
        <>
        {sessionStorage.getItem("message") === "success"? 
        (
          <>
              <div className="icon-check">
                <FontAwesomeIcon icon={faCheck}/>
              </div>
              <div className="text">
                  Datele au fost salvate cu succes! <br></br> <br></br>Vă rugăm să vă verificați e-mail-ul pentru confirmare.
              </div>
          </>
        )
        :
        (
          <>
              <div className="icon-xmark">
                <FontAwesomeIcon icon={faXmark}/>
              </div>
              <div className="text">
                  Ne pare rău....A intervenit o eroare!
              </div>
          </>
        )
        }
        </>
      )
    }
    </>
  )
}

export default SuccessPage