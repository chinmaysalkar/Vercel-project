const { User } = require('../models/users/users.model');
const { Account } = require('../models/account/account.model');

module.exports = {
    signup: async (req, res) => {
        try {
            const body = req.body;
            const accountData = await Account.create( { 'name': body.name } );
            if(accountData){
                const userData = await User.create({
                    name: body.name,
                    email: body.email,
                    password: body.password,
                    account: accountData._id,
                    address: body.address,
                    phone: body.phone,
                    country: body.country,
                    state: body.state,
                    city: body.city,
                    pincode: body.pincode
                });

                await Account.findByIdAndUpdate({ _id: accountData._id }, {
                    $set: {
                        'owner': userData._id                     
                    }
                });
            }
            res.render('Auth/success_page');
        } catch (error) {
            res.render('Auth/success_page');
        }
    },
};