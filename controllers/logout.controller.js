
module.exports = {
   
    logout:(req,res) => {
     console.log('logout');
     req.session.destroy((err) => {
            if(err){
                console.log(err);
            }else{
                res.redirect('/login'); 
            }
     });

    }


};