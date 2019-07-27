var express = require("express");
var app=express();
var router=require("./controller");//引用了controller中用到的函数


// console.log("asldfja");
app.set("view engine","ejs")//引擎的加载

//路由中间件,静态页面，在这里面静态了一个public和一个uploads
//如果想要访问这两个文件下面的文件的时候就可以进行直接访问

app.use(express.static("./public"));//这是一个中间件
app.use(express.static("./uploads"));//这个文件夹也需要静态出来
//首页
app.get("/",router.showIndex);
app.get("/:albumName",router.showAlbum);
app.get("/up",router.showUp);
app.post("/up",router.doPost);

//404
app.use(function (req,res) {
    res.render("err",{
        "baseurl":req.pathname
    });
});
app.get("/admin",function (req, res) {
    res.send("admin");
});

app.listen(80);