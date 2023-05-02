const app = require("../../app");
const database =  require("../../config/database");
const dotenv = require('dotenv');
dotenv.config();
require('dotenv').config();
const db = database.connectionDB(process.env.DATABASE);

//-----CreateAppointment.js-----

//app.post("/read-doctor") is in admin.js file

app.post("/get-available-hours", (req, res) => {
    db.query(
        "SELECT TIME_FORMAT(hour, '%H:%i') as hour FROM appointment WHERE id_doctor = ? AND date = ?",
        [req.body.idDoctor, req.body.date],
        (error, result) =>{
            if(error)
            {
                console.log(error);
            }
            else
            {
                if(result.length)
                {
                    var hours = [];
                    result.forEach(function(element){
                        hours.push(element.hour);
                    })

                    db.query(
                        "SELECT id_schedule, id_doctor, day, TIME_FORMAT(hour, '%H:%i') as hour from doctor_schedule WHERE id_doctor = ? AND day = ? AND hour NOT IN (?)",
                        [req.body.idDoctor, req.body.day, hours],
                        (error, result) =>{
                            if(error)
                            {
                                console.log(error);
                            }
                            else
                            {
                                res.send(result);
                            }
                        }
                    )
                }
                else
                {
                    db.query(
                        "SELECT id_schedule, id_doctor, day, TIME_FORMAT(hour, '%H:%i') as hour from doctor_schedule WHERE id_doctor = ? AND day = ?",
                        [req.body.idDoctor, req.body.day],
                        (error, result) =>{
                            if(error)
                            {
                                console.log(error);
                            }
                            else
                            {
                                res.send(result);
                            }
                        }
                    )
                }
            }
        }
    )
});

app.post("/create-appointment", (req, res) => {
    var date = req.body.date.substring(0,2) + "-" + req.body.date.substring(3,5) + "-" + req.body.date.substring(6,10);
    db.query("SELECT * FROM patient WHERE PIN = ? AND id_TIN = ? ", [req.body.PIN, req.body.idTIN],
        (error, resultPatient) =>{
            if(error)
            {
                res.send({error});
            }
            else
            {
                if(!resultPatient.length)
                {
                    db.query(
                        "INSERT INTO patient (lastname, firstname, PIN, gender, age, phone_number, id_TIN) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        [
                            req.body.lastname, 
                            req.body.firstname, 
                            req.body.PIN,
                            req.body.gender,
                            req.body.age,
                            req.body.phoneNumber,
                            req.body.idTIN,
                        ],
                        (error) =>{
                            if(error)
                            {
                                res.send({error});
                            }
                            else
                            {
                                db.query(
                                    "SELECT * FROM patient WHERE PIN = ? AND id_TIN = ?", [req.body.PIN, req.body.idTIN],
                                    (error, resultId) =>{
                                        if(error)
                                        {
                                            res.send({error});
                                        }
                                        else
                                        {
                                            db.query(
                                                "INSERT INTO appointment (id_patient, id_scheduler, id_doctor, date, hour) VALUES (?, ?, ?, STR_TO_DATE(?, '%d-%m-%Y'), ?)",
                                                [resultId[0].id_patient, req.body.idScheduler, req.body.idDoctor, date, req.body.hour],
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
                }
                else
                {
                    db.query(
                        "INSERT INTO appointment (id_patient, id_scheduler, id_doctor, date, hour) VALUES (?, ?, ?, STR_TO_DATE(?, '%d-%m-%Y'), ?)",
                        [resultPatient[0].id_patient, req.body.idScheduler, req.body.idDoctor, date, req.body.hour],
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
        }
    )
});

//-----DeleteAppointment.js-----

app.post("/get-appointments", (req, res) =>{
    db.query("SELECT id_patient, id_appointment, TIME_FORMAT(hour, '%H:%i') as hour, DATE_FORMAT(date, '%d-%m-%Y') as date FROM appointment WHERE id_scheduler = ?", [req.body.id_scheduler], 
    (error, resultAppointment) =>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            if(resultAppointment.length)
            {
                db.query("SELECT * FROM patient",(error, resultPatient) =>{
                    if(error)
                    {
                        console.log(error);
                    }
                    else
                    {
                        res.send({appointment: resultAppointment, patient: resultPatient});
                    }
                })
            }
        }
    })
});

app.delete("/delete-appointment/:id", (req, res) => {
    db.query("DELETE FROM appointment WHERE id_appointment = ? ", [req.params.id] , (error, result) =>{
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

//-----ListPatients.js----

app.post('/get-patients', (req, res) =>{
    db.query(
        "SELECT * FROM patient WHERE id_TIN = ?", [req.body.id_TIN],
        (error, result) =>{
            if(error)
            {
                console.log(error);
            }
            else
            {
                if(result.length)
                {
                    res.send(result);
                }
            }
        }
    )
});

//-----UpdatePatient.js-----

app.post('/get-patient-data', (req, res) =>{
    db.query(
        "SELECT * FROM patient WHERE id_patient = ?", [req.body.idPatient],
        (error, result) =>{
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.send(result[0]);
            }
        }
    )
});

app.put("/update-patient", (req, res) => {
    db.query("UPDATE patient SET lastname = ?, firstname = ?, PIN = ?, address = ?, email = ?, phone_number = ? WHERE id_patient = ? ", 
    [
        req.body.lastname, 
        req.body.firstname, 
        req.body.PIN,
        req.body.address,
        req.body.email,
        req.body.phoneNumber,
        req.body.idPatient,
    ] , (error, result) =>{
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