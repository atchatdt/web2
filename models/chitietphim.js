
var Sequelize = require('sequelize');

var db = require('./db');

var chitietphim = db.define('chitietphim',{
    idphim:{
        type:Sequelize.INTEGER
    },
    daodien:{
        type: Sequelize.STRING
    },
    dienvien:{
        type: Sequelize.STRING
    },
    theloai:{
        type: Sequelize.STRING
    },
    khoichieu:{
        type: Sequelize.STRING
    },
    ngonngu:{
        type: Sequelize.STRING
    },
    dotuoi:{
        type: Sequelize.STRING
    },
    noidung:{
        type: Sequelize.TEXT
    },
    trailer:{
        type: Sequelize.TEXT
    }
})
module.exports = chitietphim;