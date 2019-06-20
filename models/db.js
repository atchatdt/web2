const Sequelize = require('sequelize');

var url = process.env.DATABASE_URL || 'postgres://postgres:1234567@localhost:5432/quanlyrapphim';

//trưởng
//var url = process.env.DATABASE_URL || 'postgres://postgres:123@localhost:5433/quanlyrapphim';
//trường
//var url = process.env.DATABASE_URL || 'postgres://postgres:truongap21@localhost:5432/quanlyrapphim';
//Tín
//var url = process.env.DATABASE_URL || 'postgres://postgres:220515@localhost:5432/quanlyrapphim';

var db = new Sequelize(url);

module.exports = db;