
module.exports = (req,res,next)=>{
    if(req.isAuthenticated()){
        console.log('guard',req.user);
        if(req.user.isAdmin){
            //console.log('role checked')
            return next();
        }
        
    }
    res.redirect('/');
}