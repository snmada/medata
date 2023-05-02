import React from 'react'
import "../confirm-dialog/ConfirmDialog.scss"

function ConfirmDialog({setOpenDialog, setConfirm, dataWarning}) {
  return (
        <div className="container-dialog" onClick={() => {
            setOpenDialog(false);
            setConfirm(false);
        }}>
            <div className="warning-container" onClick={(e) => e.stopPropagation()}>
                <div className="warning-icon">{dataWarning.icon}</div>
                <div className="warning-text">{dataWarning.text}</div>
                <div className="div-button">
                    <button className="confirmation-button" onClick = {() => {
                        setOpenDialog(false);
                        setConfirm(true);
                    }}>{dataWarning.button}</button>

                    <button className="cancel-button" onClick={() => {
                        setOpenDialog(false);
                        setConfirm(false);
                    }}>Anulare</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog