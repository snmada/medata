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

const encodeString = (str) => {
    let buffer =  Buffer.from(str,"utf8");
    return buffer.toString("base64");
}

app.post('/forgot-password', (req, res) =>{
    const user =  req.body.id_user;
    const email = req.body.email;
    var id_user;

    if(user.length == 9)
    {
        id_user = parseInt(user.substring(3, user.length), 10);
    }
    else
    {
        id_user = username;
    }

    db.query(
        "SELECT * FROM user WHERE id_user = ?", id_user,
        (error, result) => {
            if(error)
            {
                console.log(error);
            }
            else
            {
                if(result.length > 0)
                {
                    if(result[0].role == 'admin')
                    {
                        db.query(
                            "SELECT * FROM admin WHERE id_admin = ? AND email = ?", [id_user, email],
                            (error, result) => {
                                if(error)
                                {
                                    console.log(error);
                                }
                                else
                                {
                                    if(result.length > 0)
                                    {
                                        sendEmail({
                                            from: process.env.USER,
                                            to: process.env.USER, //email,
                                            subject: "Resetare parolă MEDATA",
                                            html: `
                                                <h2>Salut!</h2>
                                                <p style="font-size:16px">A fost făcută o cerere de resetare a parolei prin intermediul aplicației MEDATA.</p>
                                                <p style="font-size:16px">Apasă butonul de mai jos pentru a putea reseta parola.</p>
                                                <a target="_" href="http://localhost:3001/reset-password/${id_user}">
                                                </br>
                                                <button style="background-color:#f44336; color:white; border-radius:4px; padding:10px 30px; border:none; cursor:pointer; font-size:16px;">Resetare parolă</button></a>
                                                <p style="font-size:16px">Accesează următorul link <a href="http://localhost:3001/reset-password/${id_user}"><span style="font-size:16px">http://localhost:3001/reset-password</span></a> dacă butonul nu este vizibil.</p>
                                                
                                            `
                                        }).then(() => {
                                            db.query(
                                                "SELECT * FROM reset_password WHERE id_user = ?", id_user,
                                                (error, result) => {
                                                    if(error)
                                                    {
                                                        console.log(error);
                                                    }
                                                    else
                                                    {
                                                        if(result.length > 0)
                                                        {
                                                            db.query(
                                                                "UPDATE reset_password SET datetime = NOW()",
                                                                (error, result) => {
                                                                    if(error)
                                                                    {
                                                                        console.log(error);
                                                                    }
                                                                    else
                                                                    {
                                                                        if(result.affectedRows)
                                                                        {
                                                                            res.send({message: "success"})
                                                                        }
                                                                    }
                                                                }
                                                            )
                                                        }
                                                        else{
                                                            db.query(
                                                                "INSERT INTO reset_password (id_user, datetime) VALUES (?, NOW())", id_user,
                                                                (error) => {
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
                                                }
                                            )
                                        }).catch((error) => {
                                                res.send({message: ""});
                                                console.log(error);
                                        })
                                    }
                                    else
                                    {
                                        res.send({message: "error"});
                                    }
                                }
                            }
                        )
                    }
                    if(result[0].role == 'doctor')
                    {
                        db.query(
                            "SELECT * FROM doctor WHERE id_doctor = ? AND email = ?", [id_user, email],
                            (error, result) => {
                                if(error)
                                {
                                    console.log(error);
                                }
                                else
                                {
                                    if(result.length > 0)
                                    {
                                        sendEmail({
                                            from: process.env.USER,
                                            to: process.env.USER, //email,
                                            subject: "Resetare parolă MEDATA",
                                            html: `
                                                <h2>Salut!</h2>
                                                <p style="font-size:16px">A fost făcută o cerere de resetare a parolei prin intermediul aplicației MEDATA.</p>
                                                <p style="font-size:16px">Apasă butonul de mai jos pentru a putea reseta parola.</p>
                                                <a target="_" href="http://localhost:3001/reset-password/${id_user}">
                                                </br>
                                                <button style="background-color:#f44336; color:white; border-radius:4px; padding:10px 30px; border:none; cursor:pointer; font-size:16px;">Resetare parolă</button></a>
                                                <br> <p style="font-size:16px">Te rugăm să accesezi următorul link dacă butonul nu este vizibil.</p>
                                                <a target="_" href="http://localhost:3001/reset-password/${id_user}"><p style="font-size:16px">http://localhost:3001/reset-password</p> </a>
                                                
                                            `
                                        }).then(() => {
                                            db.query(
                                                "SELECT * FROM reset_password WHERE id_user = ?", id_user,
                                                (error, result) => {
                                                    if(error)
                                                    {
                                                        console.log(error);
                                                    }
                                                    else
                                                    {
                                                        if(result.length > 0)
                                                        {
                                                            db.query(
                                                                "UPDATE reset_password SET datetime = NOW()",
                                                                (error, result) => {
                                                                    if(error)
                                                                    {
                                                                        console.log(error);
                                                                    }
                                                                    else
                                                                    {
                                                                        if(result.affectedRows)
                                                                        {
                                                                            res.send({message: "success"})
                                                                        }
                                                                    }
                                                                }
                                                            )
                                                        }
                                                        else
                                                        {
                                                            db.query(
                                                                "INSERT INTO reset_password (id_user, datetime) VALUES (?, NOW())", id_user,
                                                                (error) => {
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
                                                }
                                            )
                                        }).catch((error) => {
                                                res.send({message: ""});
                                                console.log(error);
                                        })
                                    }
                                    else
                                    {
                                        res.send({message: "error"});
                                    }
                                }
                            }
                        )
                    }
                    if(result[0].role == 'scheduler')
                    {
                        db.query(
                            "SELECT * FROM scheduler WHERE id_scheduler = ? AND email = ?", [id_user, email],
                            (error) => {
                                if(error)
                                {
                                    console.log(error);
                                }
                                else
                                {
                                    if(result.length > 0)
                                    {
                                        sendEmail({
                                            from: process.env.USER,
                                            to: process.env.USER, //email,
                                            subject: "Resetare parolă MEDATA",
                                            html: `
                                                <h2>Salut!</h2>
                                                <p style="font-size:16px">A fost făcută o cerere de resetare a parolei prin intermediul aplicației MEDATA.</p>
                                                <p style="font-size:16px">Apasă butonul de mai jos pentru a putea reseta parola.</p>
                                                <a target="_" href="http://localhost:3001/reset-password/${id_user}">
                                                </br>
                                                <button style="background-color:#f44336; color:white; border-radius:4px; padding:10px 30px; border:none; cursor:pointer; font-size:16px;">Resetare parolă</button></a>
                                                <br> <p style="font-size:16px">Te rugăm să accesezi următorul link dacă butonul nu este vizibil.</p>
                                                <a target="_" href="http://localhost:3001/reset-password/${id_user}"><p style="font-size:16px">http://localhost:3001/reset-password</p> </a>
                                                
                                            `
                                        }).then(() => {
                                            db.query(
                                                "SELECT * FROM reset_password WHERE id_user = ?", id_user,
                                                (error, result) => {
                                                    if(error)
                                                    {
                                                        console.log(error);
                                                    }
                                                    else
                                                    {
                                                        if(result.length > 0)
                                                        {
                                                            db.query(
                                                                "UPDATE reset_password SET datetime = NOW()",
                                                                (error, result) => {
                                                                    if(error)
                                                                    {
                                                                        console.log(error);
                                                                    }
                                                                    else
                                                                    {
                                                                        if(result.affectedRows)
                                                                        {
                                                                            res.send({message: "success"})
                                                                        }
                                                                    }
                                                                }
                                                            )
                                                        }
                                                        else
                                                        {
                                                            db.query(
                                                                "INSERT INTO reset_password (id_user, datetime) VALUES (?, NOW())", id_user,
                                                                (error) => {
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
                                                }
                                            )
                                        }).catch((error) => {
                                                res.send({message: ""});
                                                console.log(error);
                                        })
                                    }else{
                                        res.send({message: "error"});
                                    }
                                }
                            }
                        )
                    }
                }
                else{
                    res.send({message: "error"})
                }
            }
        }
    )
});


app.get("/reset-password/:id_user", function(req, res) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var token = '';
    for (i = 0; i < 25; i++) 
    {
        token += characters[Math.floor(Math.random() * characters.length )];
    }

    var date = new Date();

    db.query(
        "SELECT * FROM reset_password WHERE id_user = ? AND TIMESTAMPDIFF(SECOND, datetime, ?) < 1800", [req.params.id_user, date],
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
                        "UPDATE user SET token = ? WHERE id_user = ?", [token, req.params.id_user],
                        (error, result) =>{
                            if(error)
                            {
                                console.log(error);
                            }
                            else
                            {
                                if(result.affectedRows)
                                {
                                    let encoded_id_user = encodeString(req.params.id_user);
                                    let encoded_token = encodeString(encodeString(token));
                                    res.redirect(`http://localhost:3000/account/reset-password/${encoded_token}/${encoded_id_user}`);
                                }
                            }
                        }
                    );
                }
            }
        }
    );
});

app.post("/reset-password", function(req, res) {
    bcrypt.hash(req.body.password, saltRound, (error, hash) => {
        if(error)
        {
            console.log(error);
        }
        db.query(
            "UPDATE user SET password = ? WHERE id_user = ?", [hash, req.body.id],
            (error, result) =>{
                if(error)
                {
                    console.log(error);
                }
                else
                {
                    if(result.affectedRows)
                    {
                        db.query(
                            "DELETE FROM reset_password WHERE id_user = ?", [req.params.id_user],
                            (error, result) =>{
                                if(error)
                                {
                                    console.log(error);
                                }
                                else
                                {
                                    res.send({message: "success"});
                                }
                            }
                        );
                        
                    }
                    else
                    {
                        res.send({message: "error"});
                    }
                }
            });
    }   );
});