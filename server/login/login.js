const app = require("../app.js");
const database =  require("../config/database");
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
require('dotenv').config();
const db = database.connectionDB(process.env.DATABASE);

app.get("/login", (req, res) => {
    if(req.session.user)
    {
        res.send({loggedIn: true, user: req.session.user});
        
    }
    else
    {
        res.send({loggedIn: false});
    }
})

app.post("/login", (req, res) =>{
    const user =  req.body.user;
    const password = req.body.password;

    var id_user;

    if(user.length == 9)
    {
        id_user = parseInt(user.substring(3, user.length), 10);
    }
    else
    {
        id_user = user;
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
                    bcrypt.compare(password, result[0].password, (error, response) => {
                         if(response)
                         {
                            db.query(
                                "SELECT * FROM medical_unit WHERE id_TIN = ?", result[0].id_TIN,
                                (error, resultID) =>{
                                    if(error)
                                    {
                                        console.log(error);
                                    }
                                    else
                                    {
                                        req.session.user = result;
                                        res.send({
                                            id_user: result[0].id_user,
                                            role: result[0].role,
                                            id_TIN: resultID[0].id_TIN,
                                            TIN: resultID[0].TIN,
                                        })
                                    }
                                }
                            )
                         }
                         else
                         {
                            res.send({message: "Ați introdus date incorecte!"});
                         }
                    })
                }
                else
                {
                    res.send({message: "Utilizator inexistent!"});
                }
            }
        });
});