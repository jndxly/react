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

let noticeData = require("./data/notice")
app.get("/v1/author/notices/0/15", function(req, res){
    res.send(JSON.stringify(noticeData));
});

let projectData = require("./data/project")
app.get("/v1/project/328", function(req, res){
    res.send(JSON.stringify(projectData));
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


var server = app.listen(5000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("server端已启动 http://%s:%s", host, port)

});