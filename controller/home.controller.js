// db
const thongTinPhim = require('../models/chitietphim');
const thongTinTaiKhoan = require('../models/nguoidung');
const phim = require('../models/phim');
const rap = require('../models/rap');
const suatChieu = require('../models/suatchieu');
const cumRap = require('../models/cumrap');
const datCho = require('../models/datcho');
const mail = require('../public/functions/sendmail');
const ve = require('../models/ve');

// package.json
const fs = require('fs');
const multer = require('multer');
const Promise = require('bluebird');
const sharp = require('sharp');
const upload = multer({ dest: 'public/' });
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const id = require('short-id');


Promise.promisifyAll(fs);

module.exports.getHome = async function (req, res) {

    var toanBoPhim = await phim.findAll({
        order: [
            ['ngaycongchieu', 'DESC'],
        ],
        limit: 5,

    });

    if(toanBoPhim.length < 5)
    {
        res.render('thongbao',{thongBao:'Phải ít nhất thêm đủ 5 phim để hoạt động'});
        return;
    }
    var im = [];
    var path;

    for (let i = 0; i < toanBoPhim.length; i++) {
        var strImage = toanBoPhim[i].poster;
        if (strImage == null) {
            im.push(null);
        }
        else {
            path = "./public/images/poster/" + toanBoPhim[i].id + ".jpg";

            fs.writeFile(path, new Buffer(strImage, "base64"), err => {
                if (err) {
                    console.log("Lỗi write image: " + err);
                }
            });

            path = "/images/poster/" + toanBoPhim[i].id + ".jpg";
            im.push(path);
        }
    }

    var doanhThuPhim = [];
    var topPhim = await phim.findAll();

    var allMovie = await phim.findAll();
    var toanBoSuat = await suatChieu.findAll();
    var toanBoDatCho = await datCho.findAll();
    
    for(let i=0; i< allMovie.length; i++){

        let phim = allMovie[i].dataValues;
        let doanhThu = 0;
        for(let j = 0; j < toanBoSuat.length; j++){
            
            let sc = toanBoSuat[j].dataValues;

            if(sc.idphim == phim.id){
                for(let k =0; k < toanBoDatCho.length; k++){
                    let dc = toanBoDatCho[k].dataValues;
                    if(sc.id == dc.idsuatchieu){
                        doanhThu+= dc.tongtien;
                    }
                }
            }
        }
        var dt={
            id: phim.id,
            name: phim.name,
            poster: phim.poster,
            doanhThu: doanhThu
        }
        doanhThuPhim.push(dt);
    }



    for(let i=0 ; i< doanhThuPhim.length - 1; i++){
        for(let j = i + 1; j< doanhThuPhim.length; j++)
        {
            if(doanhThuPhim[i].doanhThu >= doanhThuPhim[j].doanhThu){
                var tam = doanhThuPhim[i];
                doanhThuPhim[i] = doanhThuPhim[j];
                doanhThuPhim[j] =tam;
            }
        }
    }

    var locPhim = [] ;
    for(let i = doanhThuPhim.length-1; i > (doanhThuPhim.length-6); i--){
        locPhim.push(doanhThuPhim[i]);
    }


    var imd =[];

    for (let i = 0 ; i < locPhim.length; i++) {
        var strImage = locPhim[i].poster;
        if (strImage == null) {
            imd.push(null);
        }
        else {
            path = "./public/images/poster/" + locPhim[i].id + ".jpg";

            fs.writeFile(path, new Buffer(strImage, "base64"), err => {
                if (err) {
                    console.log("Lỗi write image: " + err);
                }
            });

            path = "/images/poster/" + locPhim[i].id + ".jpg";
            imd.push(path);
        }
    }

    res.render('home', {
         phim: toanBoPhim, im: im ,
         locPhim : locPhim ,imd:imd
        });
}

// Lấy chi tiết phim
module.exports.getChiTietPhim = async function (req, res) {

    var id = req.params.id;

    var chiTietPhim = await thongTinPhim.findOne({
        where: {
            idphim: id
        }
    })
    var name = await phim.findOne({
        where: {
            id: id
        }
    })

    var toanBoNoiDung = await thongTinPhim.findAll({
        where: {
            idphim: id
        }
    }
    );

    var toanBoChiTiet = [];

    for (let i = 0; i < toanBoNoiDung.length; i++) {
        toanBoChiTiet.push(toanBoNoiDung[i].dataValues);
    }

    //Xử lý hình ảnh

    var im = '';
    var path;
    var strImage = name.poster;
    if (strImage == null) {
        im = null;
    }
    else {
        path = "./public/images/poster/" + name.id + ".jpg";

        fs.writeFile(path, new Buffer(strImage, "base64"), err => {
            if (err) {
                console.log("Lỗi write image: " + err);
            }
        });

        path = "/images/poster/" + name.id + ".jpg";
        im = path;
    }





    if (!chiTietPhim || !name) {
        res.redirect('/');
        return;
    } else {
        res.render('chitietphim', {
            chitietphim: chiTietPhim,
            name: name,
            toanBoChiTiet: toanBoChiTiet, im: im
        });
        return;
    }
}

module.exports.postChiTietPhim = async function (req, res) {
    var id = req.params.id;
    var chiTietPhim = await thongTinPhim.findOne({
        where: {
            idphim: id
        }
    })

}

// Thông tin tài khoan
module.exports.getThongTinCaNhan = async function (req, res) {

    var myUser = await thongTinTaiKhoan.findOne({
        where: {
            id: req.session.userId
        }
    })

    var im = myUser.avatar;
    var path;
    if (!im) {
        im = null;
    } else {
        path = "./public/images/avatar/" + req.session.userId + ".jpg";

        // Cách xem file có tồn tại hay không

        /*
        if (fs.existsSync(path)) {
            console.log('abc');

            fs.unlink(path, (err) => {
                if (err) throw err;
                console.log('path/file.txt was deleted');
              });
              console.log('xyz');
        }
        */
        fs.writeFile(path, new Buffer(im, "base64"), err => {
            if (err) {
                console.log("Lỗi write image: " + err);
            }
        });
        path = "/images/avatar/" + req.session.userId + ".jpg";
    }

    var user = myUser;
    res.render('thongtincanhan', { user: user, im: path });
}

module.exports.postThongTinCaNhan = async function (req, res) {

    var id = req.session.userId;
    var thongTinCaNhan = await thongTinTaiKhoan.findOne({
        where: {
            id: id
        }
    })
}

module.exports.getCapNhatThongTinCaNhan = async function (req, res) {
    var myUser = await thongTinTaiKhoan.findOne({
        where: {
            id: req.session.userId
        }
    })
    var user = myUser;


    res.render('capnhatthongtin', { user: user });

}
module.exports.postCapNhatThongTinCaNhan = async function (req, res) {

    var name = req.body.name;
    var sdt = req.body.sdt;


    const { path } = req.file;
    if (path) {
        const raw = await fs.readFileAsync(path);

        // Resize image
        const content = await sharp(path)
            .resize(388, 240, { fit: 'inside' })
            .jpeg({ quality: 80 })
            .toBuffer();

        await fs.unlinkAsync(path);


        var myUser = await thongTinTaiKhoan.findOne({
            where: {
                id: req.session.userId
            }
        });

        if (content) {
            myUser.avatar = content;
        }

        if (name) {
            myUser.name = name;
        }
        if (sdt) {
            myUser.sdt = sdt;
        }

        myUser.save();

        res.redirect('/thongtincanhan');

    }
}

module.exports.getTimKiem = async function (req, res) {
    
    var content = req.query.q;

    // Tìm phim
    var danhSachPhim = await phim.findAll({
        where: {
            name: {
                [Op.substring]: content
            }
        }
    })

    var toanBoPhim = [];

    for(let i=0; i< danhSachPhim.length; i++){
        toanBoPhim.push(danhSachPhim[i].dataValues);
    }
    
    

    var im = [];
    var path;

    for (let i = 0; i < toanBoPhim.length; i++) {
        var strImage = toanBoPhim[i].poster;
        if (strImage == null) {
            im.push(null);
        }
        else {
            path = "./public/images/poster/" + toanBoPhim[i].id + ".jpg";

            fs.writeFile(path, new Buffer(strImage, "base64"), err => {
                if (err) {
                    console.log("Lỗi write image: " + err);
                }
            });

            path = "/images/poster/" + toanBoPhim[i].id + ".jpg";
            im.push(path);
        }
    }

  
    res.render('timkiem', { phim:toanBoPhim,
        im:im });
}


module.exports.getMuaVe = async function (req, res) {

    var idPhim = req.params.idphim;

    var toanBoSuatChieu = await suatChieu.findAll({
        where: {
            idphim: idPhim
        }
    });

    var toanBoRap = [];
    for (let i = 0; i < toanBoSuatChieu.length; i++) {
        var Rap = await rap.findAll({
            where: {
                id: toanBoSuatChieu[i].idrap
            }
        })
        toanBoRap.push(Rap[0].dataValues);
    }

    var locRap = [];
    locRap.push(toanBoRap[0]);
    for (let i = 1; i < toanBoRap.length; i++) {
        let kt = 0;
        for(let j=0; j<locRap.length; j++){
            if(locRap[j].id == toanBoRap[i].id){
                kt++;
                break;
            }
        }
        if(kt == 0){
            locRap.push(toanBoRap[i]);
        }
    }



    var toanBoCumRap = [];
    for (let i = 0; i < toanBoRap.length; i++) {

        var cr = await cumRap.findAll({
            where: {
                id: toanBoRap[i].idcumrap
            }
        })
        //if()
        toanBoCumRap.push(cr[0].dataValues);
    }


    var mangLoc = [];
    mangLoc.push(toanBoCumRap[0]);

    for (let i = 1; i < toanBoCumRap.length; i++) {
        let kt = 0;
        for (let j = 0; j < mangLoc.length; j++) {

            if (toanBoCumRap[i].id == mangLoc[j].id) {
                kt++;
                break;
            }
        }
        if (kt == 0) {
            mangLoc.push(toanBoCumRap[i]);
        }
    }

    res.render('muave', {
        toanBoSuatChieu: toanBoSuatChieu,
        locRap: locRap,
        // toanBoCumRap: toanBoCumRap,
        mangLoc: mangLoc,
        idPhim:idPhim
    });
}

module.exports.postMuaVe = async function(req,res){

    var idCum = req.body.cumrap;
    var idRap = req.body.rap;
    var idSuat = req.body.suatchieu;
    var idPhim = req.body.idphim;

    
    var toanBoDatCho = await datCho.findAll({
        where:{
            idsuatchieu: idSuat
        }
    })

    var choDaDat = [];

    for(let i=0; i< toanBoDatCho.length; i++){

        var dc = toanBoDatCho[i].dataValues.iddatcho;

        var ghe = await ve.findAll({
            where:{
                iddatcho: dc
            }
        })
        for(let j=0; j< ghe.length; j++)
        {
            choDaDat.push(ghe[j].dataValues.maghe);
        }
       
    }

    

   


    // Danh sách đặt chỗ theo suất
    var vDatCho = await datCho.findAll({
        where:{
            idsuatchieu:idSuat
        }
    })

    // Rạp theo đặt chỗ
    var Rap = await rap.findAll({
        where:{
            id:idRap
        }
    })
    Rap = Rap[0].dataValues;
    
   /* var toanBoDatCho = [];

    for(let i=0; i< vDatCho.length; i++){
        var tam = vDatCho[i].dataValues;
        toanBoDatCho.push(tam);
    }

    

    var dsChoDaDat = await datCho.findAll({
        where:{
            idsuatchieu: idSuat
        }
    })

    var choDaDat =[];
    
    for(let i=0; i< dsChoDaDat.length; i++){
        choDaDat.push( parseInt(dsChoDaDat[i].dataValues.iddatcho));
    }*/

    res.render('chonve',{
        Rap:Rap,
        choDaDat:choDaDat,
        idCum: idCum,
        idRap:idRap,
        idSuat:idSuat,
        idPhim:idPhim

    });
}


// Function delay

function kiemTraDatVe(min,max,mangGhe,iddatcho){
    return new  Promise(function(resolve,reject){
        if(min > max){
            reject(1);
        }
        else{
            var kt = setInterval(function(){
                min++;
                for(let i=0; i< mangGhe.length; i++){
                   
                    var coDatChua = ve.findOne({
                        where:{
                            iddatcho:iddatcho,
                            maghe: mangGhe[i],
                        }
                    })
                    if(coDatChua){
                        clearTimeout(kt);
                        resolve(1);
                    }
                }
                if(min>max){
                    clearTimeout(dem);
					resolve(2);
                }
            },1000);
        }
    });
}

module.exports.postXacNhanMuaVe = async function(req,res){



    var currentdate = new Date();
    var datetime =  
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getDate() + "/"
                + currentdate.getFullYear();

    var gheDaChon = req.body.xacnhan;
    var idCum = parseInt( req.body.cumrap);
    var idRap = parseInt( req.body.rap);
    var idSuat = parseInt(req.body.suatchieu);
    var idPhim = parseInt( req.body.idphim);

    var userId = parseInt(req.session.userId);

    var mangGhe = [];
    var mangGheDaChon = gheDaChon.split(',');

    var ndXoa = req.body.xoaBo;
    var mangBo = ndXoa.split(',');



    for(let i=0; i< mangGheDaChon.length -1; i++){
         let kt=0;
        for(let j=0; j< mangBo.length ; j++){
            if(mangGheDaChon[i] == mangBo[j]){
                kt++;
                break;
            }
        }
        if(kt == 0){
            mangGhe.push(mangGheDaChon[i]);
        }
    }


    if(mangGhe.length < 1){
        res.render('thongbao',{thongBao: 'Thất bại(bại phải chọn ghế)'});
        return;
    }



    var tongTien = 0;
    //tongTien = 

    var ttSuatChieu = await suatChieu.findOne({
        where:{
            id: idSuat
        }
    })
    tongTien = ttSuatChieu.dataValues.giave * (mangGhe.length );
   
    var strGheDaChon = gheDaChon.substring(0,gheDaChon.length-1);

    const idDatCho = id.generate()+ '1' + id.generate() + id.generate();



    var datChoTheoSuat = await datCho.findAll({
        where:{
            idsuatchieu: idSuat
        }
    });

// thêm



for(let j=0; j< 2 ; j++){
    let kt = null;
    for(let i=0; i< mangGhe.length; i++){
        
        for(let k=0 ; k < datChoTheoSuat.length; k++)
        {
            kt  = await ve.findAll({
                where:{
                    iddatcho: datChoTheoSuat[k].dataValues.iddatcho,
                    maghe:mangGhe[i]
                }
            })
        }
     
        if(kt && kt.length > 0){
            thongBao = 'Đặt vé thất bại';
            res.render('thongbao',{thongBao:'Đặt vé thất bại (ghế: '+ kt[0].dataValues.maghe +' đã có người đặt)'});
            return;
        }
    }
    await Promise.delay(1000);
 }
 

// hết thêm





    

    await datCho.create({
        iddatcho: idDatCho,
        idnguoidung: userId,
        idsuatchieu: idSuat,
        thoigiandatve: datetime,
        tongtien: tongTien
    })

    for(let i=0; i< mangGhe.length ; i++){

        let idVe = id.generate() +'2' + id.generate() + id.generate();
        await ve.create({
            idve: idVe,
            iddatcho:idDatCho,
            maghe: mangGhe[i],
            giatien:ttSuatChieu.dataValues.giave
        })
    }



    var khachHang = await thongTinTaiKhoan.findOne({
        where:{
            id:userId
        }
    });

    var CRap = await cumRap.findOne({
        where:{
            id:idCum
        }
    });

    var Rap = await rap.findOne({
        where:{
            id:idRap
        }
    });

    var suat = await suatChieu.findOne({
        where:{
            id: idSuat
        }
    })
    var TTPhim = await phim.findOne({
        where:{
            id: idPhim
        }
    });

    var html = '<h1> Bạn đã đặt vé thành công </h1>';
    html = html + '<h1>' +'Mã đặt chỗ: '+ idDatCho + '</h1>';
    html = html + '<h1>'+'Cụm rạp: ' +CRap.dataValues.tenrap + ' </h1>';
    html = html + '<h1>'+ 'Địa chỉ: '+CRap.dataValues.diachi +'</h1>';
    html = html + '<h1>'+ 'Tên rạp: '+ Rap.dataValues.name + ' </h1>';
    html = html + '<h1>'+ 'Giờ bắt đầu: '+suat.batdau + ' </h1>';
    html = html + '<h1>'+'Phim: '+TTPhim.dataValues.name + ' </h1>';
    html = html + '<h1>'+ 'Ghế đã chọn: '+ strGheDaChon + '</h1>';
    html = html + '<h1>'+'Tổng tiền: '+tongTien + ' </h1>';
    html = html + '<h1>' +'Ngày đặt vé: ' + datetime + '</h1>';
    await mail(khachHang.dataValues.email,'Thông tin đặt vé','Vé xem phim',html);
    res.render('thongbao',{thongBao: 'Đặt vé thành công'});
}

module.exports.getLichSuMuaVe = async function(req,res)
{
    var userId = parseInt(req.session.userId);

    if(!userId){
        res.redirect('/');
    }
    var toanBoDatCho = await datCho.findAll({
        where:{
            idnguoidung: userId
        }
    });

    var tbdc = [];

    for(let i=0; i< toanBoDatCho.length; i++){
        tbdc.push(toanBoDatCho[i].dataValues);
    }

    if(toanBoDatCho.length < 1){
        res.render('thongbao',{thongBao: 'Bạn chưa có lịch sử'});
        return;
    }

    var toanBoSuatChieu = [];

    for(let i=0; i< toanBoDatCho.length; i++){
        var sc = await suatChieu.findAll(
            {
                where:{
                    id: toanBoDatCho[i].dataValues.idsuatchieu
                }
            }
        )
        for(let j=0; j< sc.length; j++){
            toanBoSuatChieu.push(sc[j].dataValues);
        }
    }

    // lọc kết quả trùng của suất
    var mangLoc =[];
    mangLoc.push(toanBoSuatChieu[0]);

    for(let i = 1; i< toanBoSuatChieu.length; i++)
    {
        let kt =0;
        for(let j=0; j< mangLoc.length; j++){
            if(mangLoc[j].id == toanBoSuatChieu[i].id){
                kt++;
                break;
            }
        }
        if(kt == 0){
            mangLoc.push(toanBoSuatChieu[i]);
        }
    }

    var toanBoPhim =[];

    for(let i=0; i< mangLoc.length; i++){
        var sc = await phim.findAll({
            where:{
                id: mangLoc[i].idphim
            }
        })

        for(let j= 0; j< sc.length; j++){
            toanBoPhim.push(sc[j].dataValues);
        }
    }


    var toanBoVe = [];

    for(let i = 0; i < toanBoDatCho.length ; i++){
        var ttv = await ve.findAll({
            where:{
                iddatcho: toanBoDatCho[i].dataValues.iddatcho,
            }
        });

        for(let j=0; j< ttv.length; j++){
            toanBoVe.push(ttv[j].dataValues);
        }
    }

    var locVe = [];
   for(let i = 0; i< tbdc.length; i++){
        let dc = tbdc [i];
        let strGhe = '';
        for(let j = 0;j< toanBoVe.length ; j++ )
        {
            var ttv = toanBoVe[j];
            if(dc.iddatcho == ttv.iddatcho)
            {
                strGhe+= ttv.maghe ;
                strGhe += ',';
            }
        }
        locVe.push(dc.iddatcho);
        locVe.push(strGhe.substring(0,strGhe.length-1));
   }




    res.render('lichsumuave',{
        tbdc : tbdc,
        mangLoc : mangLoc,
        ttoanBoVe : toanBoVe,
        toanBoPhim : toanBoPhim,
        locVe:locVe

    });
}

module.exports.getTatCaRap = async function(req,res){

    var cumrap = await cumRap.findAll();

    var mangCumRap =[];

    for(let i=0 ; i< cumrap.length; i++){
        mangCumRap.push(cumrap[i].dataValues);
    }
    res.render('cumrap',{mangCumRap:mangCumRap});

}

module.exports.getRap = async function(req,res){

    var cumrap = await cumRap.findAll();

    var mangCumRap =[];

    for(let i=0 ; i< cumrap.length; i++){
        mangCumRap.push(cumrap[i].dataValues);
    }

    var tcCumRap = await rap.findAll();

    var mangCum = [];

    for(let i=0; i< tcCumRap.length; i++){
        mangCum.push(tcCumRap[i].dataValues);
    }


    res.render('tatcarap',{
        mangCumRap : mangCumRap,
        mangCum : mangCum
    })

}

module.exports.getTatCaPhim = async function(req,res){

    var allMovie = await phim.findAll();

    var toanBoPhim = [];

    for(let i=0; i< allMovie.length; i++){
        toanBoPhim.push(allMovie[i].dataValues);
    }
    
    

    var im = [];
    var path;

    for (let i = 0; i < toanBoPhim.length; i++) {
        var strImage = toanBoPhim[i].poster;
        if (strImage == null) {
            im.push(null);
        }
        else {
            path = "./public/images/poster/" + toanBoPhim[i].id + ".jpg";

            fs.writeFile(path, new Buffer(strImage, "base64"), err => {
                if (err) {
                    console.log("Lỗi write image: " + err);
                }
            });

            path = "/images/poster/" + toanBoPhim[i].id + ".jpg";
            im.push(path);
        }
    }




    res.render('tatcaphim',{
        phim:toanBoPhim,
        im:im
    })
}