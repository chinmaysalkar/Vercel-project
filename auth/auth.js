
module.exports = {
    login: (req, res, next) => {
        if(req.session.auth_data)
        {
            next();           
        }else{
            res.redirect('/login');
        }
    }
};