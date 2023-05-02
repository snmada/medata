const app = require("../../app");
const database =  require("../../config/database");
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const saltRound = 10;
require('dotenv').config();

const createTransporter = require("../../nodemailer/createTransporter");
const db = database.connectionDB(process.env.DATABASE);

const sendEmail = async (emailOptions) =>{
    let transport = await createTransporter();
    await transport.sendMail(emailOptions);
}

const generateToken = () => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 30; i++)
    {
        token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token;
}

//-----CreateDoctor.js-----

app.post('/profile/add-doctor', (req, res)=>{
    let token = generateToken();
    sendEmail({
        from: process.env.USER,
        to: process.env.USER, //req.body.email,
        subject: "Activare cont DOCTOR - MEDATA",
        html: `
            <p style="font-size:20px">Salut, ${req.body.lastname} ${req.body.firstname}!</p>
            <p style="font-size:16px">A fost creat un cont prin intermediul aplicației MEDATA.</p>
            <p style="font-size:16px">Te rugăm să ne confirmi activarea acestuia apăsând butonul de mai jos.</p>
            <a target="_" href="http://localhost:3001/password/${token}">          
            </br>
            <button style="background-color:#f44336; color:white; border-radius:4px; padding:9px 40px; border:none; cursor:pointer; font-size:16px;">Activare cont</button></a>
            </br>
            <p style="font-size:16px">Accesează următorul link <a href="http://localhost:3001/password/${token}"><span style="font-size:16px">http://localhost:3001/activate</span></a> dacă butonul nu este vizibil.</p>
        `
    }).then(() => {
        db.query(
            "INSERT INTO user (id_TIN, role, token) VALUES (?, ?, ?)", [req.body.id_TIN, "doctor", token],
            (error) =>{
                if(error)
                {
                    res.send({error});
                }
                else
                {
                    db.query(
                        "SELECT * FROM user WHERE token = ?", token,
                        (error, result) =>{
                            if(error)
                            {
                                res.send({error});
                            }
                            else
                            {
                                db.query(
                                    "INSERT INTO doctor (id_doctor, lastname, firstname, PIN, medical_specialty, phone_number, email) " + 
                                    " VALUES (?, ?, ?, ?, ?, ?, ?)",
                                    [
                                        result[0].id_user,
                                        req.body.lastname,
                                        req.body.firstname,
                                        req.body.PIN,
                                        req.body.medical_specialty,
                                        req.body.phone_number,
                                        req.body.email
                                    ],
                                    (error, result) =>{
                                        if(error)
                                        {
                                            res.send({error});
                                        }
                                        else
                                        {
                                            res.send(result);
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
        res.send({error});
    })
});

//-----ReadDeleteDoctor.js-----

app.post("/read-doctor", (req, res) => {
    db.query(
        "SELECT id_user FROM user WHERE role = 'doctor' AND status = 'Activated' AND id_TIN = ?", [req.body.id_TIN], (error, result) => {
            if(error)
            {
                console.log(error);
            }
            else
            {
                if(result.length)
                {
                    var arr = [];
                    result.forEach(function(object){
                        arr.push(object.id_user);
                    })

                    db.query("SELECT id_doctor, lastname, firstname, PIN, medical_specialty, phone_number, email FROM doctor WHERE id_doctor IN (?)", [arr], (error, result) =>{
                        if(error)
                        {
                            console.log(error);
                        }
                        else
                        {
                            res.send(result);
                        }
                    })
                }
            }
        }
    )
});

app.delete("/delete-doctor/:id", (req, res) => {
    db.query("DELETE FROM doctor WHERE id_doctor = ? ", [req.params.id] , (error, result) =>{
        if(error)
        {
            res.send({error});
        }
        else
        {
            res.send(result);
        }
    })
});

//-----UpdateDoctor.js-----

app.post("/get-doctor", (req, res) => {
    db.query("SELECT * FROM doctor WHERE id_doctor = ? ", [req.body.id_doctor],
    (error, result) =>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            res.send(result[0]);
        }
    })
});

app.put("/update-doctor", (req, res) => {
    db.query("UPDATE doctor SET "
                + "lastname = ?, firstname = ?, medical_specialty = ?, " 
                + "PIN = ?, phone_number = ?, email = ? WHERE id_doctor = ? ", 
    [   req.body.lastname, 
        req.body.firstname, 
        req.body.medical_specialty, 
        req.body.PIN, 
        req.body.phone_number, 
        req.body.email, 
        req.body.id_doctor,
    ] , (error, result) =>{
        if(error)
        {
            res.send({error});
        }
        else
        {
            if(result.affectedRows)
            {
                res.send(result);
            }
        }
    })
});

//-----CreateScheduler.js-----

app.post('/add-scheduler', (req, res)=>{
    let token = generateToken();
    sendEmail({
        from: process.env.USER,
        to: process.env.USER, //req.body.email,
        subject: "Activare cont RECEPȚIONER MEDICAL - MEDATA",
        html: `
            <p style="font-size:20px">Salut, ${req.body.lastname} ${req.body.firstname}!</p>
            <p style="font-size:16px">A fost creat un cont prin intermediul aplicației MEDATA.</p>
            <p style="font-size:16px">Te rugăm să ne confirmi activarea acestuia apăsând butonul de mai jos.</p>
            <a target="_" href="http://localhost:3001/password/${token}">          
            </br>
            <button style="background-color:#f44336; color:white; border-radius:4px; padding:9px 40px; border:none; cursor:pointer; font-size:16px;">Activare cont</button></a>
            </br>
            <p style="font-size:16px">Accesează următorul link <a href="http://localhost:3001/password/${token}"><span style="font-size:16px">http://localhost:3001/activate</span></a> dacă butonul nu este vizibil.</p>
        `
    }).then(() => {
        db.query(
            "INSERT INTO user (id_TIN, role, token) VALUES (?, ?, ?)",
            [req.body.id_TIN, "scheduler", token],
            (error) =>{
                if(error)
                {
                    res.send({error});
                }
                else
                {
                    db.query(
                        "SELECT * FROM user WHERE token = ?", token,
                        (error, result) =>{
                            if(error)
                            {
                                res.send({error});
                            }
                            else
                            {
                                db.query(
                                    "INSERT INTO scheduler (id_scheduler, lastname, firstname, PIN, phone_number, email) " + 
                                    " VALUES (?, ?, ?, ?, ?, ?)",
                                    [
                                        result[0].id_user,
                                        req.body.lastname,
                                        req.body.firstname,
                                        req.body.PIN,
                                        req.body.phone_number,
                                        req.body.email
                                    ],
                                    (error, result) =>{
                                        if(error)
                                        {
                                            res.send({error});
                                        }
                                        else
                                        {
                                            res.send(result);
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
        res.send({error});
    })
});

//-----ReadDeleteScheduler.js-----

app.post("/read-scheduler", (req, res) =>{
    db.query(
        "SELECT id_user FROM user WHERE role = 'scheduler' AND status = 'Activated' AND id_TIN = ? ", [req.body.id_TIN], (error, rows) =>{
            if(error)
            {
                console.log(error);
            }
            else
            {
                var arr = [];
                rows.forEach(function(row){
                    arr.push(row.id_user);
                })

                if(arr.length)
                {
                    db.query("SELECT * FROM scheduler WHERE id_scheduler IN (?)", [arr], (error, result) =>{
                        if(error)
                        {
                            console.log(error);
                        }
                        else
                        {
                            res.send(result);
                        }
                    })
                }
            }
        }
    )
});

app.delete("/delete-scheduler/:id", (req, res) => {
    db.query("DELETE FROM scheduler WHERE id_scheduler = ? ", [req.params.id] , (error, result) =>{
        if(error)
        {
            res.send({error});
        }
        else
        {
            res.send(result);
        }
    })
});

//-----UpdateScheduler.js-----

app.post("/get-scheduler", (req, res) => {
    db.query("SELECT * FROM scheduler WHERE id_scheduler = ? ", [req.body.id_scheduler],
    (error, result) =>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            res.send(result[0]);
        }
    })
});

app.put("/update-scheduler", (req, res) => {
    db.query("UPDATE scheduler SET "
                + "lastname = ?, firstname = ?, " 
                + "PIN = ?, phone_number = ?, email = ? WHERE id_scheduler = ? ", 
    [   req.body.lastname, 
        req.body.firstname,  
        req.body.PIN, 
        req.body.phone_number, 
        req.body.email, 
        req.body.id_scheduler,
    ] , (error, result) =>{
        if(error)
        {
            res.send({error});
        }
        else
        {
            if(result.affectedRows)
            {
                res.send(result);
            }
        }
    })
});

//-----DoctorSchedule.js-----

app.post('/read-doctor-schedule', function(req, res){
    db.query(
        "SELECT id_schedule, id_doctor, day, TIME_FORMAT(hour, '%H:%i') as hour FROM doctor_schedule WHERE id_doctor = ?",
        [req.body.id_doctor],
        (error, result) =>{
            if(error)
            {
                res.send({error});
            }
            else
            {
                if(result)
                {
                    res.send(result);
                }
            }
        }
    )
});

app.post("/get-doctor-name", (req, res) => {
    db.query("SELECT * FROM doctor WHERE id_doctor = ? ", [req.body.id_doctor],
    (error, result) =>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            res.send(result[0].lastname + " " + result[0].firstname);
        }
    })
});

app.post("/add-doctor-schedule", function(req, res){
    db.query(
        "SELECT * FROM doctor_schedule WHERE id_doctor = ? AND day = ? AND hour = ?",
        [req.body.id_doctor, req.body.day, req.body.hour],
        (error, result) =>{
            if(error)
            {
                res.send({error});
            }
            else
            {
                if(result == 0)
                {
                    db.query(
                        "INSERT INTO doctor_schedule(id_doctor, day, hour) VALUES(?, ?, ?)",
                        [req.body.id_doctor, req.body.day, req.body.hour, req.body.id_doctor],
                        (error, result) =>{
                            if(error)
                            {
                                res.send({error});
                            }
                            else
                            {
                                if(result)
                                {
                                    res.send({message: "success"});
                                }
                            }
                        }
                    )
                }else{
                    res.send({message: "error"});
                }
            }
        }
    )
});

app.delete("/delete-doctor-schedule/:id", (req, res) => {
    db.query("DELETE FROM doctor_schedule WHERE id_schedule = ? ", [req.params.id] , (error, result) =>{
        if(error)
        {
            res.send({error});
        }
        else
        {
            res.send(result);
        }
    })
});

//-----Settings.js-----

app.post('/deactivate-account', function(req, res){
    db.query(
        "SELECT * FROM user WHERE id_user = ?", req.body.id_admin,
        (error, result) => {
            if(error)
            {
                res.send({message: "error"});
            }
            else
            {
                if(result.length > 0)
                {
                    db.query(
                        "SELECT * FROM admin WHERE id_admin = ?", req.body.id_admin,
                        (error, result) => {
                            if(error)
                            {
                                res.send({message: "error"});
                            }
                            else
                            {
                                if(result.length > 0)
                                {
                                    sendEmail({
                                        from: process.env.USER,
                                        to: process.env.USER, //result[0].email,
                                        subject: "Dezactivare cont MEDATA",
                                        html: `
                                            <h2>Salut!</h2>
                                            <p style="font-size:16px">A fost făcută o cerere de dezactivare a contului prin intermediul aplicației MEDATA.</p>
                                            <p style="font-size:16px">Vă rugăm să confirmați apăsând butonul de mai jos.</p>
                                            <p style="font-size:16px">Dacă NU doriți dezactivarea contului atunci NU apăsați butonul de mai jos.</p>
                                            <a target="_" href="http://localhost:3001/deactivate/${req.body.id_TIN}/${result[0].email}">          
                                            </br>
                                            <button style="background-color:#f44336; color:white; border-radius:4px; padding:9px 40px; border:none; cursor:pointer; font-size:16px;">Dezactivare cont</button></a>
                                            </br>
                                            <p style="font-size:16px">Accesează următorul link <a href="http://localhost:3001/deactivate/${req.body.id_TIN}/${result[0].email}"><span style="font-size:16px">http://localhost:3001/deactivate</span></a> dacă butonul nu este vizibil.</p>
                                        `
                                    }).then(() => {
                                        res.send({message: "success"});
                                    }).catch(() => {
                                        res.send({message: "error"});
                                    })
                                }
                            }
                        }
                    )
                }
            }
        }
    )
});


app.get("/deactivate/:TIN/:email", function(req, res) {
    db.query(
        "DELETE FROM user WHERE id_TIN = ?", req.params.TIN,
        (error, result) =>{
            if(error)
            {
                res.send({error});
            }
            else
            {
                if(result.affectedRows)
                {
                    db.query(
                        "DELETE FROM patient WHERE id_TIN = ?", req.params.TIN,
                        (error, result) =>{
                            if(error)
                            {
                                res.send({error});
                            }
                            else
                            {
                                 sendEmail({
                                    from: process.env.USER,
                                    to: process.env.USER, //req.params.email,
                                    subject: "Cont dezactivat MEDATA",
                                    html: `
                                        <h2>Salut!</h2>
                                    <h2>Contul MEDATA a fost dezactivat!</h2>
                                        `
                                }).then(() => {
                                    res.redirect("http://localhost:3000");
                                }).catch((error) => {console.log(error)})
                            }
                        }
                    )
                }
            }
        }
    )
});