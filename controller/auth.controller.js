
const user = require('../models/nguoidung');
const bcrypt = require('bcrypt');
var id = require('short-id');
const saltRounds = 10;

const mail = require('../public/functions/sendmail');
const resetPass = require('../models/resetpass');


module.exports.getRegister = function(req,res){
    var errors = [];
    var value ={};
    res.render('auth/register',{errors:errors,value: value});
}

module.exports.postRegister = async function(req,res){
    var userName = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var sdt =  req.body.sdt;

    var value = req.body;

    var errors = [];
    if(!userName){
        errors.push('Tên không được bỏ trống');
    }
    if(!email){
        errors.push('Email không được bỏ trống');
    }
    if(!password){
        errors.push('Password không được bỏ trống');
    }
    if(!sdt){
        errors.push('Số điện thoại không được bỏ trống');
    }
    if(errors.length > 0){
        res.render('auth/register',{errors:errors, value: value});
        return;
    }
    var User = await user.findOne({
        where:{
            email: email
        }
    });

    if(User){
        errors.push('Email đã tồn tại');
        res.render('auth/register',{errors:errors, value: value});
        return;
    }

    var secret = id.generate();
    secret += id.generate();
    var hash = bcrypt.hashSync(password, saltRounds);
    await user.create({
        email:email,
        name: userName,
        password: hash,
        sdt: sdt,
        idadmin: 0,
        active: 0,
        secret: secret
    })
    var html = '<h1>Click vào link để kích hoạt tài khoản</h1>';
    var link = '<a href="http://localhost:8080/auth/active/'+secret +'">Link<a>';
    html = html+link;
    await mail(email,'Kích hoạt tài khoản','Kích hoạt tìa khoản',html);
    res.render('auth/login');
}

module.exports.getActive = async function (req,res){
    var secret = req.params.secret;

    var User = await user.findOne({
        where:{
            secret: secret
        }
    })
    if(!User){
        var errors = [];
        var value ={};
        res.render('auth/register',{errors:errors,value: value});
        return;
    }
    User.active = 1;
    User.save();
    res.render('auth/login');
}

module.exports.getLogin = function(req,res){
    
    res.render('auth/login');
}

module.exports.postLogin = async function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    var User = await user.findOne({
        where:{
        email: email,
        }
    })
    if(!User || (User.active != 1)){
        res.redirect('/auth/login');
        return;
    }
    if(bcrypt.compareSync(password, User.password)){
        req.session.userId = User.id;
        res.redirect('/');
    }

res.redirect('/auth/login');
}


module.exports.getResetPassword = function(req,res){
    res.render('auth/resetpassword');
}
module.exports.postResetPassword = async function(req,res){
    var email = req.body.email;

    var secret= id.generate();
    secret += id.generate();

    var userReset = await resetPass.findOne({
        where:{
            email: email
        }
    });
    var User = user.findOne({
        where:{
            email:email
        }
    });

    if(User){
        if(!userReset){
            await resetPass.create({
                email: email,
                secret: secret
            });
        }
        else{
            userReset.secret = secret;
            userReset.save();
        }
    }
    var html = '<h1>Click vào link để reset password</h1>';
    var link = '<a href="http://localhost:8080/auth/password/'+secret +'">Link<a>';
    html = html+link;
    const info = await mail(email,'Quên mật khẩu', 'Bạn có quên mật khẩu', html);

    res.redirect('/');
}

module.exports.getPassword = function(req,res){
    var secret = req.params.secret;
    res.render('auth/password',{secret:secret});
}

module.exports.postPassword = async function(req,res){
    var secret = req.params.secret;
    var password = req.body.password;

    var User = await resetPass.findOne({
        secret:secret
    });

    if(User){
        var userEmail = await user.findOne({
            email: User.email
        })
        var hash = bcrypt.hashSync(password, saltRounds);
        userEmail.password = hash;
        userEmail.save();

        User.secret = id.generate() + id.generate();
        User.save();
    }
    res.redirect('/');
}

module.exports.getLogout = function(req,res){
    delete req.session.userId;
    res.redirect('/');
}

module.exports.getDoiMatKhau =  function(req,res)
{
    res.render('auth/doimatkhau');
}

module.exports.postDoiMatKhau = async function (req,res){


    var password = req.body.mkc;
    var mkm = req.body.mkm;

    var userID = req.session.userId;

    var User = await user.findOne({
        where:{
            id:userID,
        }
    })

    if(!User){
        res.render('/auth/login');
        return;
    }

    if(bcrypt.compareSync(password, User.password)){
        var hash = bcrypt.hashSync(mkm, saltRounds);
        User.password = hash;
        User.save();
        res.redirect('/');
        return;
    }
    else{
        res.render('auth/doimatkhau');
        return;
    }


}
