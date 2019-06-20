
var Sequelize = require('sequelize');

var db = require('./db');

var datcho = db.define('datcho',{
    iddatcho:{
        type: Sequelize.STRING
    },
    idnguoidung:{
        type:Sequelize.INTEGER
    },
    idsuatchieu:{
        type:Sequelize.INTEGER
    },
    thoigiandatve:{
        type: Sequelize.STRING
    },
    tongtien:{
        type: Sequelize.DOUBLE
    }
});

module.exports = datcho;