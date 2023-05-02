import React, {useState} from 'react'
import "../settings/Settings.scss"
import Axios from 'axios'
import AlertMessage from '../../../../components/alert-message/AlertMessage'

function Settings() {

    const [open, setOpen] = useState(false);
    const [close, setClose] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");

    function deactivateAccount() {
        Axios.post('http://localhost:3001/deactivate-account',{
            id_TIN: sessionStorage.getItem("id_TIN"),
            id_admin: sessionStorage.getItem("UID"),
        }).then((response) => {
            if(response.data.message == "success")
            {
                setOpen(true);
            }
            else
            {
                setClose(false);
                setAlertMessage({
                    message: "A intervenit o eroare!", 
                    type: "error"
                });
            }
        }).catch(() => {
            setClose(false);
            setAlertMessage({
                message: "A intervenit o eroare!", 
                type: "error"
            });
        })
    }

    function displayAlertMessage() {
        if(close === false)
        {
            return <AlertMessage setClose = {setClose} alertMessage = {alertMessage}/>
        }
    }

  return (
    <div className="admin">
        <div className="admin-container">
            {displayAlertMessage()}
            <div className="settings-container">
                <div className="title">Dezactivarea contului</div>
                <div className="body">
                    ATENȚIE! Odată cu dezactivarea contului se vor șterge definitiv toate datele. <br></br>Acestea nu vor mai putea fi recuperate niciodată! <br></br><br></br>

                    <div className="button-container">
                        <button className="deactivation-button" onClick={() => {deactivateAccount()}}>Dezactivare cont</button>
                    </div>
                </div>
                <div className={open? "message active":"message"}>
                    A fost trimis un e-mail de confirmare. <br></br>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Settings