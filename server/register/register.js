const app = require('../app.js');
const database =  require('../config/database');
const bcrypt = require('bcrypt');
const saltRound = 10;
const dotenv = require('dotenv');
dotenv.config();
require('dotenv').config();

const createTransporter = require("../nodemailer/createTransporter");
const db = database.connectionDB(process.env.DATABASE);

const sendEmail = async (emailOptions) =>{
    let transport = await createTransporter();
    await transport.sendMail(emailOptions);
}

app.post('/register/TIN', (req, res) =>{
    const TIN = req.body.TIN;
    db.query(
        "SELECT * FROM medical_unit WHERE TIN = ?", TIN,
        (error, result) =>{
            if(error)
            {
                console.log(error);
            }
            else
            {
                if(result.length)
                {
                    db.query(
                        "SELECT * FROM user WHERE id_TIN = ? and role = 'admin'", result[0].id_TIN,
                        (error, result) =>{
                            if(error)
                            {
                                console.log(error);
                            }
                            else
                            {
                                if(result.length)
                                {

                                    if(result[0].status == "Activated")
                                    {
                                        res.send({message: "Există deja un cont!", code: "0"});
                                    }
                                    else
                                    {
                                        res.send({message: "Vă rugăm să vă activați contul!", code: "0"});
                                    }
                                }
                                else
                                {
                                    res.send({message: "", code: "1"});
                                }
                            }
                        }
                    )
                }
                else
                {
                    res.send({message: "CIF inexistent!", code: "0"});
                }
            }
        }
    )
});

app.post('/register', (req, res) =>{

    const TIN = req.body.TIN;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const PIN = req.body.PIN;
    const email = req.body.email;
    const password = req.body.password;
    var id_TIN;

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var token = '';
    for (i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length )];
    }

    db.query(
        "SELECT * FROM medical_unit WHERE TIN = ?", TIN,
        (error, result) => {
            if(error)
            {
                console.log(error);
            }
            else
            {
                id_TIN = result[0].id_TIN;

                bcrypt.hash(password, saltRound, (error, hash) =>{
                    if(error)
                    {
                        console.log(error);
                    }
                    else
                    {
                        sendEmail({
                            from: process.env.USER,
                            to: process.env.USER, //email
                            subject: "Activare cont MEDATA",
                            html: `
                                <p style="font-size:20px">Salut, ${lastname} ${firstname}!</p>
                                <p style="font-size:16px">Îți mulțumim că ai ales aplicația noastră!</p>
                                <p style="font-size:16px">Te rugăm să ne confirmi activarea contului apăsând butonul de mai jos.</p>
                                <a target="_" href="http://localhost:3001/activate/${TIN}/${token}">
                                </br>
                                <button style="background-color:#f44336; color:white; border-radius:4px; padding:9px 40px; border:none; cursor:pointer; font-size:16px;">Activare cont</button></a>
                                <p style="font-size:16px">Accesează următorul link <a href="http://localhost:3001/activate/${TIN}/${token}"><span style="font-size:16px">http://localhost:3001/activate</span></a> dacă butonul nu este vizibil.</p>
                                
                            `
                        }).then(() => {
                            db.query(
                                "INSERT INTO user (password, id_TIN, role, token, status) VALUES (?, ?, ?, ?, ?)",
                                [hash, id_TIN, 'admin', token, 'Pending'],
                                (error) =>{
                                    if(error)
                                    {
                                        console.log(error);
                                    }
                                    else
                                    {
                                        db.query(
                                            "SELECT * FROM user WHERE token = ?", token,
                                            (error, result) =>{
                                                if(error)
                                                {
                                                    console.log(error);
                                                }
                                                else
                                                {
                                                    db.query(
                                                        "INSERT INTO admin (id_admin, lastname, firstname, PIN, email) VALUES (?, ?, ?, ?, ?)",
                                                        [result[0].id_user, lastname, firstname, PIN, email],
                                                        (error) =>{
                                                            if(error)
                                                            {
                                                                console.log(error);
                                                            }
                                                            else
                                                            {
                                                                res.send({message: "success"})
                                                            }
                                                        }
                                                    )
                                                }
                                            }
                                        )
                                    }
                                }
                            )
                        })
                        .catch((error) => {
                            res.send({message: "error"});
                            console.log(error);
                        })
                    }
                })
            }
        }
    )
});

const encodeString = (str) => {
    let buffer =  Buffer.from(str,"utf8");
    return buffer.toString("base64");
}

app.get("/activate/:TIN/:token", function(req, res) {
    db.query(
        "UPDATE user SET status='Activated' WHERE token = ? AND status='Pending'", req.params.token,
        (err, result) =>{
            if(err)
            {
                console.log(err);
            }
            else
            {
                if(result.affectedRows)
                {
                    db.query("SELECT LPAD(id_user, 6, '0') as id_user FROM user WHERE token = ?", req.params.token, (err, result)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let encoded_id_user = encodeString(result[0].id_user);
                            let encoded_token = encodeString(encodeString(req.params.token));
                            res.redirect(`http://localhost:3000/account/activated/${encoded_token}/${encoded_id_user}`);
                        }
                    })
                }
            }
        }
    )
});