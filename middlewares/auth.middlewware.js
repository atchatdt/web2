var User = require('../models/nguoidung');

module.exports.auth = async function (req, res, next) {
   
    const { userId } = req.session;
    if(!userId){
      res.redirect('/auth/login');
      return;
    }
    else{
      var user = await User.findOne({
        where:{
          id: userId,
          idadmin:1
        }
      })
      if(user){
        res.locals.admin = 1;
      }
    next();
    }
  }

  module.exports.authAdmin = async function(req,res,next){
   
    const  userId = req.session.userId;
    if(!userId){
      res.redirect('/auth/login');
      return;
    }
    else{
      var user = await User.findOne({
        where:{
          id: userId,
          idadmin:1
        }
      })
      if(user){
        next();
        
      }
      else{
        res.redirect('/auth/login');
      }
    }
}