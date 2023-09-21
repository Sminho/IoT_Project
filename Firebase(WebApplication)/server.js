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
    //설정 페이지-모터 별 버튼, 각도 지정
    if(path=="/setting"){
        res.write(fs.readFileSync("index.html"));
        var motor_number = query.motor_number;
        var servo_angle = query.servo_angle;
        fs.writeFileSync("manual.txt","manual,"+ motor_number + "," + servo_angle);
        res.write("<html><body><script>history.back();</script></body></html>");
    }
    //제어 페이지-버튼 제어
    if(path=="/control"){
        res.write(fs.readFileSync("/db/control.html"));
    }
    //FAQ 페이지
    if(path=="/index"){
        res.write(fs.readFileSync("index.html"));
    }  
    //ESP32가 받아올 값
    if(path=="/manual"){
        res.write(fs.readFileSync("/db/manual.txt"));
    }
    res.end();
    console.log("서버 접속 " + fs.readFileSync("manual.txt"));
})
app.listen(80);
console.log("서버 작동");