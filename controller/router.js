var file=require("../models/file.js");
var formidable = require('formidable');
var path=require("path");
var fs=require("fs");
var sd = require("silly-datetime");
exports.showIndex=function(req, res,next) {
    // res.writeHead(200,{"content-type":"text/html;charsetutf-8"});
    // res.send("我是首页");
    /* res.render("index",{
         "albums":file.getAllAlbums()
     });*/
    //引擎渲染，这个文件是render到整体的包中进行查找，然后就会返回一个自己所需要的文件。
    //引擎渲染，会到views中自动进行查找看，这个文件下面有没有自己所需要的文件，然后进行加载到自己的render中去。
    //render的机理就是用fs进行模块的读文件
    // req.send("我是首页");

    //直接利用回调函数进行返回自己想要的东西就可以了
    //因为是异步实习的所以在这个上面需要进行调用回掉函数，不可以进行直接的传递参数。
    file.getAllAlbums(function (err,allAlabums) {
        if (err){
            // res.send(err);
            next();
            return;

        }
        res.render("index",{
            "albums":allAlabums
        })
    })
};
exports.showAlbum=function (req, res,next) {
    //遍历相册中的所有的图片
    var albumName=req.params.albumName;//得到输入的url中的路径部分
    //具体业务交给model层
    //通过相册的名字得到这个相册图片
    //得到的是文件名，得不到图片这个图像
    file.getAllImagesByAlbumName(albumName,function (err,imagesArray) {
        if (err){
            // res.send(err);
            // res.render("err");
            next();//交给下面的中间键进行处理
            return;
        }
        res.render("album",{
            "albumname":albumName,
            "images":imagesArray
        });
    });
}
//显示上传
exports.showUp=function (req, res) {
    //命令file模块（我们自己写的函数）调用getAllAlbums函数
    //得到所有文件夹名字做的事情，写在回调函数里面
   file.getAllAlbums(function (err, albums) {
       res.render("up",{
           albums:albums
       });
   });
}

//上传模块
exports.doPost=function (req, res) {
    var form = new formidable.IncomingForm();
    // console.log(__dirname);
    // console.log(__dirname+"/../tempup/");
    form.uploadDir = path.normalize(+__dirname+"/../tempup/");
    form.parse(req, function(err, fields, files,next) {
        // console.log(fields);
        // console.log(files);
        if (err){
            next();//这个中间件不受理这个请求了，请直接往下走
            return;
        }
/*        var size=parseInt(files.tupian.size);
        if (size>102400){
            res.send("图片尺寸应该小于1M");
            //删除图片
            fs.unlink(files.tupian.path);
            return;
        }*/
        var ttt=sd.format(new Date(),"YYYYMMDDHHmmss");
        var ran = parseInt(Math.random()*89999+10000);
        var extname=path.extname(files.tupian.name);
        var wenjianjia=fields.wenjianjia;
        var oldpath=files.tupian.path;
        // var newpath=path.normalize(__dirname+"/../uploads/"+wenjianjia+"/"+ttt+ran+extname);
        var newpath=path.normalize(__dirname+"/../uploads/"+wenjianjia+"/"+files.tupian.name);
        fs.rename(oldpath,newpath,function (err) {
            if (err){
                res.send("改名失败")
            }
            res.send("成功");
        });
    });

    return;
}