import React, {useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import "../success-activation/Activated.scss"
import {Buffer} from 'buffer'
import Axios from 'axios'

function Activated() {

    const param = useParams();
    const navigate = useNavigate();

    function decodeString(str) {
        let buffer = Buffer.from(str, "base64");
        return buffer.toString("utf8");
    }

    useEffect(() => {
        Axios.post("http://localhost:3001/verify-credentials", {
            id: decodeString(param.id),
            token: decodeString(decodeString(param.token))
        }).then((response) => {
            if(response.data.message == "error")
            {
                navigate("/");
            }
        })
    }, []);
    
  return (
    <div className="activated">
        <div className="container">
            <h1 id="success">Contul dumneavoastră a fost activat cu succes!</h1>
            <h1 id="message">La fiecare autentificare în cont vă rugăm să folosiți următorul ID: <b>UID{decodeString(param.id)}</b></h1><br></br>
            <h1 id="warning">ATENȚIE! Vă sugerăm să rețineți sau să notați acest ID întrucât nu poate fi recuperat după închiderea acestei pagini!</h1>
            <br></br>
        </div>
    </div>
  )
}

export default Activated