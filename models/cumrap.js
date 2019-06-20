
var Sequelize = require('sequelize');

var db = require('./db');

var cumrap = db.define('cumrap',{
    
    tenrap:{
        type: Sequelize.STRING
    },
    diachi:{
        type: Sequelize.STRING
    },
});

module.exports = cumrap;