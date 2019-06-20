
var Sequelize = require('sequelize');

var db = require('./db');

var user = db.define('users',{

    email:{
        type: Sequelize.STRING
    },
    name:{
        type: Sequelize.STRING
    },
    password:{
        type: Sequelize.STRING
    },
    sdt:{
        type: Sequelize.STRING
    },
    avatar:{
        type: Sequelize.BLOB,
    },
    idadmin:{
        type:Sequelize.INTEGER
    },
    active:{
        type:Sequelize.INTEGER
    },
    secret:{
        type: Sequelize.STRING
    }

})

module.exports = user;