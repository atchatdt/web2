const user = require('../models/nguoidung');
const rap = require('../models/rap');
const cumrap = require('../models/cumrap');
const phim = require('../models/phim');
const suatChieu = require('../models/suatchieu');
const chiTietPhim = require('../models/chitietphim');
const datCho = require('../models/datcho');

// pack.json
const fs = require('fs');
const multer = require('multer');
const Promise = require('bluebird');
const sharp = require('sharp');
const upload = multer({ dest: 'public/' });
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

Promise.promisifyAll(fs);


module.exports.getHome = async function(req, res) {
    var doanThu = [];
    var doanhThuPhim = [];
    res.render('admin/homeadmin',{doanThu:doanThu,doanhThuPhim:doanhThuPhim});
}

module.exports.postDoanhThuCumRap = async function(req,res){

    // theo cụm rạp
    var strBegin = null;
    var strEnd  = null;
    strBegin = req.body.begin;
    strEnd = req.body.end;

    var arrBegin = strBegin.split('-');
    var arrEnd = strEnd.split('-');

    strBegin = arrBegin[1]+'/'+arrBegin[2]+'/'+arrBegin[0];
    strEnd = arrEnd[1] + '/' + arrEnd[2] + '/' + arrEnd[0];

    var dateBegin = Date.parse(strBegin);
    var dateEnd = Date.parse(strEnd);


    var toanBoDatCho =  await datCho.findAll();

    
    var toanBoCumRap = await cumrap.findAll();

    var toanBoRap = await rap.findAll();

    var toanBoSuatChieu = await suatChieu.findAll();


    var datVeTrongKhoanThoiGian = [];

    for(let i=0; i< toanBoDatCho.length; i++){
        var tam  = toanBoDatCho[i].dataValues;
        var thoiGianDatVe = Date.parse(tam.thoigiandatve);

        if(thoiGianDatVe >= dateBegin && thoiGianDatVe <= dateEnd){
            datVeTrongKhoanThoiGian.push(tam);
        }
    }


    

    var doanThu = [];


    for(let i=0; i< toanBoCumRap.length; i++){
        let tongDoanhThu =0;
        let cum = toanBoCumRap[i].dataValues;

        for(let j=0; j< toanBoRap.length; j++){

            let rap = toanBoRap[j].dataValues;
            
            if(rap.idcumrap == cum.id){

                for(let k=0; k< toanBoSuatChieu.length; k++){

                    let suatChieu = toanBoSuatChieu[k].dataValues;

                    if(rap.id == suatChieu.idrap)
                    {
                        for(let m =0; m < datVeTrongKhoanThoiGian.length; m++){
                            var datVe = datVeTrongKhoanThoiGian[m];
                            if(datVe.idsuatchieu == suatChieu.id){
                                tongDoanhThu += datVe.tongtien;
                            }
                        }
                    }
                }
            }
        }
        doanThu.push(cum.tenrap);
        doanThu.push(tongDoanhThu);
        doanThu.push(strBegin);
        doanThu.push(strEnd);
    }
    var doanhThuPhim =[];
    // theo phim

    res.render('admin/homeadmin',{doanThu:doanThu,doanhThuPhim:doanhThuPhim});
    
}

module.exports.postDoanhThuPhim = async function(req,res){
    var strBegin = null;
    var strEnd  = null;
    strBegin = req.body.beginmovie;
    strEnd = req.body.endmovie;

    var arrBegin = strBegin.split('-');
    var arrEnd = strEnd.split('-');

    strBegin = arrBegin[1]+'/'+arrBegin[2]+'/'+arrBegin[0];
    strEnd = arrEnd[1] + '/' + arrEnd[2] + '/' + arrEnd[0];

    var dateBegin = Date.parse(strBegin);
    var dateEnd = Date.parse(strEnd);

    var toanBoPhim = await phim.findAll();

    var toanBoSuatChieu = await suatChieu.findAll();

    var toanBoDatCho =  await datCho.findAll();

    var datVeTrongKhoanThoiGian = [];

    for(let i=0; i< toanBoDatCho.length; i++){
        var tam  = toanBoDatCho[i].dataValues;
        var thoiGianDatVe = Date.parse(tam.thoigiandatve);

        if(thoiGianDatVe >= dateBegin && thoiGianDatVe <= dateEnd){
            datVeTrongKhoanThoiGian.push(tam);
        }
    }

    var doanhThuPhim = [];

    for(let i=0; i< toanBoPhim.length; i++){

        let phim = toanBoPhim[i].dataValues;
        let doanhThu = 0;
        
        for(let j=0; j< toanBoSuatChieu.length; j++){

            let suatChieu = toanBoSuatChieu[j].dataValues;

            if(suatChieu.idphim == phim.id)
            {
                for(let k=0; k< datVeTrongKhoanThoiGian.length; k++){

                    let datVe = datVeTrongKhoanThoiGian[k];

                    if(datVe.idsuatchieu == suatChieu.id){
                        doanhThu += datVe.tongtien;
                    }
                }
            }
        }
        doanhThuPhim.push(phim.name);
        doanhThuPhim.push(doanhThu);
        doanhThuPhim.push(strBegin);
        doanhThuPhim.push(strEnd);
    }
    var doanThu = [];
    res.render('admin/homeadmin',{doanThu:doanThu,doanhThuPhim:doanhThuPhim});

}

module.exports.getTaiKhoan = async function(req, res) {

    var toanBoTaiKhoan = await user.findAll();

    // Xửa lý hình ảnh

    var im = [];
    var path;
    for (let i = 0; i < toanBoTaiKhoan.length; i++) {
        var strImage = toanBoTaiKhoan[i].avatar;
        if (!strImage) {
            im.push('');
        } else {
            path = "./public/images/avatar/" + toanBoTaiKhoan[i].id + ".jpg";

            fs.writeFile(path, new Buffer(strImage, "base64"), err => {
                if (err) {
                    console.log("Lỗi write image: " + err);
                }
            });

            path = "/images/avatar/" + toanBoTaiKhoan[i].id + ".jpg";
            im.push(path);
        }

    }

    res.render('admin/taikhoanadmin', { toanBoTaiKhoan: toanBoTaiKhoan, im: im });
}

module.exports.getPhim = async function(req, res) {

    var toanBoPhim = await phim.findAll();

    var im = [];
    var path;

    for(let i= 0; i< toanBoPhim.length; i++){
        var strImage = toanBoPhim[i].poster;
        if(strImage == null ){
            im.push(null);
        }
        else{
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

    res.render('admin/phimadmin',{toanBoPhim:toanBoPhim, im:im});
}


module.exports.postThemPhim = async function(req,res){

    var name = req.body.name;
    var ngayCongChieu = req.body.ngayCongChieu;
    var thoiLuong = req.body.thoiluong;

    await phim.create({
        name:name,
        ngaycongchieu: ngayCongChieu,
        thoiluong: thoiLuong
    });
    res.redirect('/admin/phim');
}

module.exports.postThemHinhAnh = async function(req,res){

    var id = req.body.id;

    const {path} = req.file;

    const raw = await fs.readFileAsync(path);

    // Resize image
    const content = await sharp(path)
        .resize(190, 260, { fit: 'inside' })
        .jpeg({ quality: 80 })
        .toBuffer();

    await fs.unlinkAsync(path);

    var updatePhim = await phim.findOne({
        where:{
            id:id
        }
    });

    updatePhim.poster = content;
    updatePhim.save();

    res.redirect('/admin/phim');
    
}


module.exports.getXoaPhim = async function(req,res){
    var idPhim = req.params.id;
    await phim.destroy({
        where: {
            id: idPhim
        }
    });

    path = "./public/images/poster/" + idPhim+ ".jpg";
    if (fs.existsSync(path)) {
        console.log('abc');

        fs.unlink(path, (err) => {
            if (err) throw err;
            console.log('path/file.txt was deleted');
          });
          console.log('xyz');
    }

    res.redirect('/admin/phim');
}

module.exports.getRap = async function(req, res) {

    var toanBoRap = await rap.findAll();
    var toabBoCumRap = await cumrap.findAll();

    res.render('admin/rapadmin', { toanBoRap: toanBoRap, toabBoCumRap:toabBoCumRap });
}

module.exports.postThemRap = async function (req,res){

    var tenRap = req.body.tenrap;
    var cumrap =  req.body.idcumrap;
    var loai = parseInt( req.body.loai);
    var ngang = parseInt (req.body.ngang);
    var doc = parseInt(req.body.doc);

    await rap.create({
        name: tenRap,
        idcumrap: cumrap,
        loai:loai,
        ngang:ngang,
        doc:doc,
    })

    res.redirect('/admin/rap');

}

module.exports.getCumRap = async function(req, res) {
    var toanBoCumRap = await cumrap.findAll();
    res.render('admin/cumrapadmin', { toanBoCumRap: toanBoCumRap });
}

module.exports.postThemCumRap = async function(req,res){
    
    var tenRap = req.body.tenrap;
    var diaChi = req.body.diachi;

    await cumrap.create({
        tenrap: tenRap,
        diachi: diaChi
    })
    res.redirect('/admin/cumrap');
}

module.exports.getSuatChieu = async function(req, res) {

    var toanBoSuatChieu = await suatChieu.findAll();
    var toanBoPhim = await phim.findAll();
    var toanBoRap = await rap.findAll();

    res.render('admin/suatchieuadmin',{toanBoSuatChieu:toanBoSuatChieu,
        toanBoPhim:toanBoPhim,
        toanBoRap:toanBoRap });
}

module.exports.postThemSuat = async function(req,res){
    var idPhim = parseInt (req.body.idphim);
    var idRap = parseInt(req.body.idrap);
    var batDau = req.body.bd;
    var ketThuc = req.body.kt;
    var giaVe = req.body.giave;

    await suatChieu.create({
        idphim: idPhim,
        idrap: idRap,
        batdau: batDau,
        ketthuc: ketThuc,
        giave: giaVe
    })
    res.redirect('/admin/suatchieu');
}

module.exports.getChiTietPhim = async function(req,res){

    var toanBoPhim = await phim.findAll();
    var toanBoChiTiet = await chiTietPhim.findAll();
    res.render('admin/chitietphimadmin',{ toanBoPhim : toanBoPhim,
                                         toanBoChiTiet : toanBoChiTiet });
}

module.exports.postThemChiTietPhim = async function(req,res){

    var idPhim = parseInt (req.body.idphim);
    var daoDien =  req.body.daodien;
    var dienVien = req.body.dienvien;
    var theLoai = req.body.theloai;
    var khoiChieu = req.body.khoichieu;
    var ngonNgu = req.body.ngonngu;
    var doTuoi = req.body.dotuoi;
    var noiDung = req.body.noidung;
    var trailer = req.body.trailer;

    await chiTietPhim.create({
        idphim: idPhim,
        daodien: daoDien,
        dienvien: dienVien,
        theloai: theLoai,
        khoichieu: khoiChieu,
        ngonngu: ngonNgu,
        dotuoi: doTuoi,
        noidung: noiDung,
        trailer:trailer
    })
    res.redirect('/admin/chitietphim');

}
module.exports.getXoaSuat = async function(req,res){

    var idSuat = req.params.id;

    await suatChieu.destroy({
        where:{
        id:idSuat

        }
    });
    res.redirect('/admin/suatchieu');
}

module.exports.getDatCho = async function(req, res) {

    var toanBoDatCho = await datCho.findAll();
    var toanBoNguoiDung = await user.findAll();

    res.render('admin/datchoadmin',{toanBoDatCho:toanBoDatCho,toanBoNguoiDung:toanBoNguoiDung});
}
/*
module.exports.getToanBoVe = async function(req,res){



    var toanBoDatCho = await datCho.findAll();

    var tbdc = [];

    for(let i=0; i< toanBoDatCho.length; i++){
        tbdc.push(toanBoDatCho[i].dataValues);
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

    res.render('admin/toanbove',{
        tbdc : tbdc,
        mangLoc : mangLoc,
        ttoanBoVe : toanBoVe,
        toanBoPhim : toanBoPhim,
        locVe:locVe

    });
}
*/



module.exports.getXoaTaiKhoan = async function(req, res) {

    var idUser = req.params.id;

    await user.destroy({
        where: {
            id: idUser
        }
    })

    path = "./public/images/avatar/" + idUser+ ".jpg";
    if (fs.existsSync(path)) {
        console.log('abc');

        fs.unlink(path, (err) => {
            if (err) throw err;
            console.log('path/file.txt was deleted');
          });
          console.log('xyz');
    }


    res.redirect('/admin/taikhoan');
}

module.exports.getXoaCumRap = async function(req, res) {

    var idCumRap = req.params.id;

    await cumrap.destroy({
        where: {
            id: idCumRap
        }
    })

    res.redirect('/admin/cumrap');
}

module.exports.getXoaRap = async function(req, res) {

    var idRap = req.params.id;

    await rap.destroy({
        where: {
            id: idRap
        }
    })

    res.redirect('/admin/rap');
}

module.exports.getXoatChiTietPhim = async function(req,res){
    var idChiTiet = req.params.id;

    await chiTietPhim.destroy({
        where:{
            id:idChiTiet
        }
    });

    res.redirect('/admin/chitietphim');
}

module.exports.getXoaDatCho = async function(req,res){
    var id = req.params.id;

    await datCho.destroy({
        where:{
            id:id
        }
    })

    res.redirect('/admin/datcho');
}