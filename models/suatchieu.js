
var Sequelize = require('sequelize');

var db = require('./db');

var suatchieu = db.define('suatchieu',{
    idphim:{
        type:Sequelize.INTEGER
    },
    idrap:{
        type:Sequelize.INTEGER
    },
    batdau:{
        type:Sequelize.STRING
    },
    ketthuc:{
        type:Sequelize.STRING
    },
    giave:{
        type: Sequelize.DOUBLE
    }
})
module.exports = suatchieu;