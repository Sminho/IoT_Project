var http = require('http');
var url = require('url');
var fs = require('fs');

var app = http.createServer(function(req, res){
    var URL = req.url;
    var path = url.parse(URL, true).pathname;
    var query = url.parse(URL, true).query;
 
    res.writeHead(200);
    //홈 페이지-소개글
    if(path=="/index"){
        res.write(fs.readFileSync("index.html"));
    }
    //설정 페이지-모터 별 버튼, 각도 지정, 예약설정
    if(path=="/setting"){
        res.write(fs.readFileSync("setting.html"));
    }
    //제어 페이지-버튼 제어
    if(path=="/control"){
        res.write(fs.readFileSync("control.html"));
    }
    //FAQ 페이지
    if(path=="/faq"){
        res.write(fs.readFileSync("faq.html"));
    }  
})
app.listen(80);
console.log("서버 작동");