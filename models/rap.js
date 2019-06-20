
var Sequelize = require('sequelize');

var db = require('./db');

var rap = db.define('rap',{

    name:{
        type: Sequelize.STRING
    },
    idcumrap:{
        type:Sequelize.INTEGER
    },
    loai:{
        type:Sequelize.INTEGER
    },
    ngang:{
        type:Sequelize.INTEGER
    },
    doc:{
        type:Sequelize.INTEGER
    }
});

module.exports = rap;