


module.exports = {
    send_verification_otp: (req, res) => {
        const { mobno } = req.body;

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const serviceSid = process.env.TWILIO_SERVICE_SID;
        const client = require('twilio')(accountSid, authToken);

        client.verify.v2.services(serviceSid)
            .verifications
            .create({ to: "+91" + mobno, channel: 'sms' })
            .then((verification) => {
                console.log(verification);
                res.render('Auth/otp_verify', { verify_data: verification, no: mobno, title: 'Verify Code', page_title: 'Verify Code', folder: 'Apps' });
            })
            .catch((err) => {
                return console.log(err);
            })
    },
    verify_otp: (req, res) => {
        const { mobno, otp } = req.body;

        const serviceSid = process.env.TWILIO_SERVICE_SID;

        client.verify.v2.services(serviceSid)
        .verificationChecks
        .create({to: mobno, code: otp})
        .then((verification_check) => {
            console.log(verification_check);
            if(verification_check.status = "approved"){
                res.render('customer/customer_account', { verify_data: verification_check, no: mobno, title: 'Customers Account', page_title: 'Customers Account', folder: 'Apps' });
            } else {
                res.locals = { title: 'Customer Login' };
                console.log('login fail');
                req.flash('message', 'OTP Code is Incorrect !!!');
                req.flash('status', 'danger');
                res.render('Auth/customer_login', { message: req.flash('message'), status: req.flash('status') });
            }            
        })
        .catch((err) => {
            return console.log(err);
        })
    },
};

