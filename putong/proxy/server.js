var express = require('express');
var app = express();

app.post("/v1/auth/sendSMS",function(req, res){
    let json = {"error":0,"cookie":"1b5ede80-a3be-4b43-89ab-f7f8e20a05de"};
    res.send(JSON.stringify(json));
});

let smsData = require("./data/smsVerify");
app.post("/v1/auth/loginSMSVerify", function(req, res){
    res.send(JSON.stringify(smsData));
});

app.get("/v1/author/author_messages/0/15", function(req, res){
    let json = {"error":0,"rows":0,"unread":0,"messages":[]}
    res.send(JSON.stringify(json));
});

let allData = require("./data/all")
app.get("/v1/project/all", function(req, res){
    res.send(JSON.stringify(allData));
});
app.get("/v1/project/all", function(req, res){
    res.send(JSON.stringify(allData));
});

let noticeData = require("./data/notice")
app.get("/myStory/list", function(req, res){
    res.send(JSON.stringify(allData));
});

let projectData = require("./data/project")
app.get("/v1/project/328", function(req, res){
    res.send(JSON.stringify(projectData));
});
app.get("/myStory/info", function(req, res){
    res.send(JSON.stringify(projectData));
});

app.get("/v1/author/notices/0/15", function(req, res){
    res.send(JSON.stringify(noticeData));
});

app.get("/v1/project_comment/328", function(req, res){
    let json = {"error":0,"project_comment":null};
    res.send(JSON.stringify(json));
});

app.post("/v1/project/328", function(req, res){
    let json = {"error":0};
    res.send(JSON.stringify(json));
});

app.get("/sockjs-node", function(req, res){
    let json = {"error":0};
    res.send(JSON.stringify(json));
});

app.get("/v1/author/avatar/sign", function(req, res){

    res.send("q-sign-algorithm=sha1&q-ak=AKIDHRQFxtMSFwTuAHCyd9UksreMwKWmvreJ&q-sign-time=1548832451;1548832751&q-key-time=1548832451;1548832751&q-header-list=&q-url-param-list=&q-signature=b7afb56a7e6ac1ab4b8955d75d7e3232a6796f48");
});

app.post("/v1/project/new", function(req, res){
    let json = {"error":0,"id":337};
    res.send(JSON.stringify(json));
});

app.post("/v1/project/del", function(req, res){
    let json = {"error":0}
    res.send(JSON.stringify(json));
});


app.post("/v1/project", function(req, res){
    let json = {"error":0}
    res.send(JSON.stringify(json));
});
// app.post("/fileUpload/upload", function(req, res){
//     let json = {"error":0}
//     res.send(JSON.stringify(json));
// });


var server = app.listen(3001, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("server端已启动 http://%s:%s", host, port)

});