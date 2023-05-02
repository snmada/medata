require('dotenv').config();
const nodemailer = require("nodemailer");
const {google} = require('googleapis');

const createTransporter = async () =>{
    const OAuth2 = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );

    OAuth2.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });

    const ACCESS_TOKEN = await new Promise((resolve, reject) =>{
        OAuth2.getAccessToken((error, token) => {
            if(error)
            {
                reject("Can't create access token!");
            }
            else
            {
                resolve(token);
            }
        })
    })

    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth:{
            type: 'OAuth2',
            user: process.env.USER,
            clientId: process.env.CLIENT_ID,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: ACCESS_TOKEN
        }
    })

    return transporter;
}

module.exports = createTransporter