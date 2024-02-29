const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: ".env" });

async function generateOTP(lenght) {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < lenght; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

async function sendSMS(phone, otp) {
    try {
        const auth = process.env.SMS_AUTH_TOKEN;
        const template = process.env.SMS_TEMPLATE_ID;
        const MSG91_ENDPOINT = 'https://control.msg91.com/api/v5/flow/';
        const mobile = `91${phone}`;
        const options = {
            method: 'POST',
            url: MSG91_ENDPOINT,
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authkey: auth
            },
            data: { 
                template_id: template,
                recipients: [
                    { 
                        mobiles: mobile, 
                        var: otp
                    }
                ]  
            }
        };
        axios.request(options)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.error(error);
            });
    } catch (error) {
        throw error;
    }
}

module.exports = { generateOTP, sendSMS };