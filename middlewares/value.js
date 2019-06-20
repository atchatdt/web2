var User = require('../models/nguoidung');

module.exports.value = async function(req,res,next){
   
    res.locals.currentUser = null;
    res.locals.admin = 0;
    const { userId } = req.session;
    if (!userId) {
      next();
    } else {
      User.findOne({
        where: {
          id: userId,
        }
      }).then(function(user) {
        if (!user) {
          delete req.session.userId;
          next();
        } else {
          res.locals.currentUser = user;
          if(user.idadmin == 1){
            res.locals.admin = 1;
          }
          next();
        }
      }).catch(next);
    }
}