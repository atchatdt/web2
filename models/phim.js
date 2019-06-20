
var Sequelize = require('sequelize');

var db = require('./db');

var phim = db.define('phim',{
    name:{
        type: Sequelize.STRING
    },
    ngaycongchieu:{
        type: Sequelize.STRING
    },
    poster:{
        type: Sequelize.BLOB,
    },
    thoiluong:{
        type: Sequelize.STRING
    }
});
module.exports = phim;