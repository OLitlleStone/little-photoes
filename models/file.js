//封装所有关于文件的操作
var fs=require("fs");//这个fs是文件夹用到的变量，这个变量可以
//在用到的地方进行引用在用不到的变量不用引用，当然也可以在其他的地方进行引用
//因为这是一个全局的变量。

//这个函数的callback中含有两个参数，一个是err
//另一个是存放所有文件夹的名字的array。
exports.getAllAlbums=function (callback) {//nodejs中是异步实现的所以就不能直接进行返回
    //需要进行直接返回，利用回调函数就可以完成这个工作。
    //(__dirname+"./")__dirname+"./"+它自己的目录是__dirname，然后再加上./回到上一级
    fs.readdir("./uploads",function (err,files) {
        if (err){
            callback("没有找到uploads文件夹",null);
        }
        var allAlbums=[];
        // console.log(files);
        console.log(files.length);
        (function iterator(i) {
            if(i==files.length){
                // console.log(allAlbums);
                return callback(null,allAlbums);
            }
            // console.log(allAlbums);
            fs.stat("./uploads/"+files[i],function (err, stats) {
                if (err){
                    callback("没有找到文件"+files[i],null);
                }
                // console.log(allAlbums);
                if (stats.isDirectory()){
                    allAlbums.push(files[i]);
                }
                iterator(i+1);
            });
        })(0);

    })
    //我们现在集中精力找到所有文件夹
    return;
}
//通过文件名得到所有的图片
exports.getAllImagesByAlbumName=function (albumName,callback) {
    fs.readdir("./uploads/"+albumName,function (err,files) {
        if (err){
            callback("没有找到"+albumName+"图片",null);
            return;
        }
        var allImages=[];
        (function iterator(i) {
            if(i==files.length){
                // console.log(allImages);
                return callback(null,allImages);
            }
            // console.log(allImages);
            fs.stat("./uploads/"+albumName+"/"+files[i],function (err, stats) {
                if (err){
                    callback("没有找到文件"+files[i],null);
                }
                // console.log(files[i]);
                if (stats.isFile()){
                    allImages.push(files[i]);
                }
                iterator(i+1);
            });
        })(0);

    })
}