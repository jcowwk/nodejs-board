// express 모듈을 express 변수에 담기
const express=require('express');
const session = require('express-session');
const connection = require('./database');

const server=express();

// JSON 형태의 여청 body 파싱하는 미들웨어 사용
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// 검색 시 나오는 화면
server.get('/',function(req,res){
    res.sendFile(__dirname+'/login.html');
})

// 로그인 화면
server.get('/login.html',function(req,res){
    res.sendFile(__dirname+'/login.html');
})

// 회원가입 화면
server.get('/join.html',function(req,res){
    res.sendFile(__dirname+'/join.html');
})

// 메인 화면
server.get('/list.html',function(req,res){
    res.sendFile(__dirname+'/list.html');
})

// 글 작성 화면
server.get('/create.html',function(req,res){
    res.sendFile(__dirname+'/create.html');
})

// 글 읽기 화면
server.get('/read.html',function(req,res){
    res.sendFile(__dirname+'/read.html');
})

// 수정 화면
server.get('/update.html',function(req,res){
    res.sendFile(__dirname+'/update.html');
})

// 로그인 성공 시 메인 화면
server.post('/login',function(req,res){
    res.sendFile(__dirname+'/list.html');
})

// 회원가입 성공 시 로그인 화면
server.post('/join',function(req,res){
    const id=req.body.joinId;
    const pw = req.body.joinPw;
    const username = req.body.userName;
    
    var find = "SELECT id FROM user WHERE id = ?";
    var paramsF=[id];

    connection.query(find, paramsF, function(err, result){
        if(err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
        }
        // result는 결과셋이 아닌 객체 또는 배열
        if(result.length > 0){
            console.log("이미 존재하는 아이디입니다.");
        }
        else {
            console.log("사용 가능한 아이디입니다.");

            var sql="INSERT INTO user (id, pw, username) VALUES (?, ?, ?)";
            var params=[id, pw, username];

            connection.query(sql, params, function(err, result){
                if(err) throw err;
                else {
                    console.log("회원 가입이 완료 되었습니다!");
                    res.sendFile(__dirname+'/login.html');
                }
            });
        }
    });
})

// 글 작성 완료 시 메인 화면
server.post('/create',function(req,res){
    res.sendFile(__dirname+'/list.html');
})

// 수정 완료 시 읽기 화면
server.post('/update',function(req,res){
    res.sendFile(__dirname+'/read.html');
})

server.listen(3000);