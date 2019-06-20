
var Sequelize = require('sequelize');

var db = require('./db');

var ve = db.define('ve',{
    idve:{
        type: Sequelize.STRING
    },
    iddatcho:{
        type: Sequelize.STRING
    },
    maghe:{
        type: Sequelize.STRING
    },
    ngang:{
        type: Sequelize.STRING
    },
    doc:{
        type: Sequelize.STRING
    },
    giatien:{
        type: Sequelize.DOUBLE
    }
})
module.exports = ve;