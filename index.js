//.env
require('dotenv').config();

// từ package
const express = require('express');
const session =  require('express-session');
const bodyParser = require('body-parser');

//Tự định nghĩ từ các file

const home = require('./routes/home.route');
const admin = require('./routes/admin.route');
const auth = require('./routes/auth.route');
const db = require('./models/db');
const value = require('./middlewares/value');


// Chỉnh sửa lại file middleware cho admin và đăng nhập
const authMiddleware = require('./middlewares/auth.middlewware');


const app = express();


app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));


app.use(bodyParser.urlencoded({
    extended: true,
  }));
  
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));


const port = process.env.port || 8080;

app.use(value.value);

app.use('/',home);

app.use('/admin',authMiddleware.authAdmin ,admin);

app.use('/auth',auth);


db.sync().then(function() {
    app.listen(port);
       console.log(`Server is listening on port ${port}`);
     }).catch(function(err) {
       console.log(err);
       process.exit(1);
     });
     