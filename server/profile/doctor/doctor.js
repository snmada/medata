const app = require("../../app");
const database =  require("../../config/database");
const dotenv = require('dotenv');
dotenv.config();
require('dotenv').config();
const db = database.connectionDB(process.env.DATABASE);

//-----Appointment.js-----

app.post('/get-schedule', (req, res) =>{
    const arr = req.body.arr;
    var dates = [];

        arr.forEach(function(a){
            dates.push(a.year + "-" + a.month + "-" + a.day);
        })

        db.query(
            "SELECT DATE_FORMAT(date, '%Y-%m-%d') as date, id_patient, TIME_FORMAT(hour, '%H:%i') as hour FROM appointment " 
            + "WHERE id_doctor = ? AND date IN (?)",
            [req.body.id_doctor, dates],
            (error, resultAppointment) =>{
                if(error)
                {
                    console.log(error);
                }
                else
                {
                    if(resultAppointment.length > 0)
                    {
                        var names = [];
                        resultAppointment.forEach(function(el){
                            if((names.indexOf(el.id_patient) === -1))
                            {
                                names.push(el.id_patient);
                            }
                        })
    
                        db.query(
                            "SELECT id_patient, lastname, firstname FROM patient WHERE id_patient IN (?)",
                            [names],
                            (error, resultPatient) =>{
                                if(error)
                                {
                                    console.log(error);
                                }
                                else
                                {
                                    res.send({resultAppointment: resultAppointment, resultPatient: resultPatient});
                                }
                            }
                        )
                    }
                    else
                    {
                        res.send({resultAppointment: resultAppointment});
                    }
                }
            }
        )
   
});

//-----ListPatients.js-----

app.post('/get-patient', (req, res) =>{
    db.query(
        "SELECT id_patient FROM medical_record WHERE id_doctor = ?",
        [req.body.id_doctor],
        (error, result) =>{
            if(error)
            {
                console.log(error);
            }
            else
            {
                if(result.length > 0)
                {
                    var arr = [];
                    result.forEach(function(object){
                        if(!arr.includes(object.id_patient)){
                            arr.push(object.id_patient)
                        }
                    })

                    db.query(
                        "SELECT id_patient, lastname, firstname, PIN FROM patient WHERE id_patient IN (?)", [arr],
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

app.delete("/delete-patient/:id", (req, res) => {
    db.query("DELETE FROM patient WHERE id_patient = ? ", [req.params.id] , (error, result) =>{
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

//-----AddMedicalRecord.js-----

app.post('/add-medical-record', (req, res) =>{
    db.query(
        "INSERT INTO medical_record(id_patient, id_doctor, date, examination, symptom, medical_history, primary_diagnosis, secondary_diagnosis, " 
        + " treatment, recommendation, conclusions, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            req.body.id_patient,
            req.body.id_doctor,
            req.body.date,
            req.body.examination,
            req.body.symptom,
            req.body.medical_history,
            req.body.main_diagnosis,
            req.body.secondary_diagnoses,
            req.body.treatment,
            req.body.recommendation,
            req.body.conclusions,
            req.body.notes
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
});

//-----Patient.js-----

app.post('/get-patient-info', (req, res) =>{
    db.query(
        "SELECT * FROM patient WHERE id_patient = ?",
        [req.body.id_patient],
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
});

app.post('/get-doctor-name', (req, res) =>{
    db.query(
        "SELECT lastname, firstname FROM doctor WHERE id_doctor = ?",
        [req.body.id_doctor],
        (error, result) =>{
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.send(result[0].lastname + " " + result[0].firstname)
            }
        }
    )
});

app.post('/get-medical-records', (req, res) =>{
    db.query(
        "SELECT *, DATE_FORMAT(date, '%d-%m-%Y') as date  FROM medical_record WHERE id_patient = ? AND id_doctor = ?",
        [req.body.id_patient, req.body.id_doctor],
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
});

app.delete("/delete-medical-record/:id", (req, res) => {
    db.query("DELETE FROM medical_record WHERE id_medical_record = ? ", [req.params.id] , (error, result) =>{
        if(error)
        {
            console.log(error);
            res.send({error});
        }
        else
        {
            res.send(result);
        }
    })
});