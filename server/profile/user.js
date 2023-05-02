const app = require("../app");
const database =  require("../config/database");
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const saltRound = 10;
require('dotenv').config();

const db = database.connectionDB(process.env.DATABASE);

app.post("/profile", (req, res) => {
    if((req.body.role) == "admin")
    {
        db.query("SELECT * FROM admin WHERE id_admin = ? ", [req.body.UID],
         (error, result) =>{
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
    if((req.body.role) == "doctor")
    {
        db.query("SELECT * FROM doctor WHERE id_doctor = ? ", [req.body.UID],
        (error, result) =>{
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

    if((req.body.role) == "scheduler")
    {
        db.query("SELECT * FROM scheduler WHERE id_scheduler = ? ", [req.body.UID],
        (error, result) =>{
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

});

app.post("/verify-credentials", function(req, res) {
    db.query(
        "SELECT * FROM user WHERE id_user = ? AND token = ?", [req.body.id, req.body.token],
        (error, result) =>{
            if(error)
            {
                console.log(error);
            }
            else
            {
                if(!result.length)
                {
                    res.send({message: "error"});
                }
            }
        }
    )
});

app.post('/set-password/:id', function(req, res){
    bcrypt.hash(req.body.password, saltRound, (error, hash) => {
        if(error)
        {
            console.log(error);
        }
        db.query(
            "UPDATE user SET password = ?, status = 'Activated' WHERE id_user = ?", [hash, req.body.id],
            (error, result) =>{
                if(error)
                {
                    console.log(error);
                }
                else
                {
                    if(result.affectedRows)
                    {
                        res.send({message: "success"});
                    }
                }
            });
    }   );
});

const encodeString = (str) => {
    let buffer =  Buffer.from(str,"utf8");
    return buffer.toString("base64");
}

app.get("/password/:token", function(req, res) {
    db.query("SELECT LPAD(id_user, 6, '0') as id_user FROM user WHERE token = ? AND status = 'Pending'", req.params.token, (error, result)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            if(result.length)
            {
                let encoded_id_user = encodeString(result[0].id_user);
                let encoded_token = encodeString(encodeString(req.params.token));
                res.redirect(`http://localhost:3000/account/password/${encoded_token}/${encoded_id_user}`);
            }
        }
    })
});