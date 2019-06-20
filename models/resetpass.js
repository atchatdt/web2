
var Sequelize = require('sequelize');

var db = require('./db');

var reserPass = db.define('resetpassword',{

    email:{
        type: Sequelize.STRING
    },
    secret:{
        type:Sequelize.STRING
    }
});
module.exports = reserPass;