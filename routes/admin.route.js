const Router = require('express').Router;
var homeAdmin = require('../controller/admin.controller');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = new Router();

router.get('/', homeAdmin.getHome);

router.post('/doanthucumrap',homeAdmin.postDoanhThuCumRap);

router.post('/doanthuphim',homeAdmin.postDoanhThuPhim);

router.get('/taikhoan', homeAdmin.getTaiKhoan);

router.get('/phim', homeAdmin.getPhim);

router.post('/themphim',homeAdmin.postThemPhim);

router.post('/themhinhanh',upload.single('picture'),homeAdmin.postThemHinhAnh);

router.get('/rap', homeAdmin.getRap);

router.get('/cumrap', homeAdmin.getCumRap);

router.post('/themrap',homeAdmin.postThemRap);

router.post('/themcumrap',homeAdmin.postThemCumRap);

router.get('/suatchieu', homeAdmin.getSuatChieu);

router.post('/themsuat',homeAdmin.postThemSuat);

router.get('/datcho', homeAdmin.getDatCho);

router.get('/chitietphim',homeAdmin.getChiTietPhim);

//router.get('/toanbove',homeAdmin.getToanBoVe);

router.post('/themchitietphim',homeAdmin.postThemChiTietPhim);

router.get('/xoataikhoan/:id', homeAdmin.getXoaTaiKhoan);

router.get('/xoacumrap/:id', homeAdmin.getXoaCumRap);

router.get('/xoarap/:id',homeAdmin.getXoaRap);

router.get('/xoaphim/:id',homeAdmin.getXoaPhim);

router.get('/xoasuat/:id',homeAdmin.getXoaSuat);

router.get('/xoachitietphim/:id',homeAdmin.getXoatChiTietPhim);

router.get('/xoadatcho/:id',homeAdmin.getXoaDatCho);

module.exports = router;