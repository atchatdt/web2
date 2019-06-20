const Router = require('express').Router;
const home = require('../controller/home.controller');
const authMiddleware = require('../middlewares/auth.middlewware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = new Router();

// Trang chủ
router.get('/',home.getHome);

// Thông tin về phim (chi tiết)
router.get('/chitietphim/:id',home.getChiTietPhim);
router.post('/chitietphim/:id',home.postChiTietPhim);

// Thông tin trang cá nhân (Xét middleware)
router.get('/thongtincanhan',authMiddleware.auth,home.getThongTinCaNhan);
router.post('/thongtincanhan',authMiddleware.auth,home.postThongTinCaNhan);


router.get('/capnhatthongtin',authMiddleware.auth,home.getCapNhatThongTinCaNhan);
router.post('/capnhatthongtin',authMiddleware.auth,upload.single('picture'),home.postCapNhatThongTinCaNhan);

router.get('/timkiem',home.getTimKiem);

router.get('/muave/:idphim',home.getMuaVe);
router.post('/muave',authMiddleware.auth,home.postMuaVe);

router.post('/chonve',home.postXacNhanMuaVe);
router.get('/lichsumuave',home.getLichSuMuaVe);

router.get('/tatcacumrap',home.getTatCaRap);
router.get('/tatcarap',home.getRap);

router.get('/tatcacacphim',home.getTatCaPhim);

//router.get('/chonve',home.getChonVe);


// Thông tin các cụm rạp
//router.get('/thongtincumrap',home.getThongTinCumRap);
//router.post('/thongtincumrap',home.postThongTinCumRap);



module.exports = router;