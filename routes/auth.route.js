const Router = require('express').Router;
const router = new Router();
const auth = require('../controller/auth.controller');

router.get('/register',auth.getRegister);
router.post('/register',auth.postRegister);
router.get('/active/:secret',auth.getActive);

router.get('/login',auth.getLogin);
router.post('/login',auth.postLogin);

router.get('/resetpassword',auth.getResetPassword);
router.post('/resetpassword',auth.postResetPassword);

router.get('/password/:secret',auth.getPassword);
router.post('/password/:secret',auth.postPassword);

router.get('/doimatkhau',auth.getDoiMatKhau);
router.post('/doimatkhau',auth.postDoiMatKhau);

router.get('/logout',auth.getLogout);

module.exports = router;