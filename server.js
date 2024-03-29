// express 모듈을 express 변수에 담기
const express=require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const connection = require('./database');

const server=express();

server.set('view engine', 'ejs');

// 세션 사용 설정
server.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'abcdefg'
}))

// JSON 형태의 body 파싱하는 미들웨어 사용
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// 정적 파일 라우팅
server.use(express.static(__dirname));

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
server.get('/list',function(req,res){
    const sql="SELECT * FROM board";

    connection.query(sql, function(err, result){
        if(err){
            console.error(error);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.render('list', { items: result });
    });
})

// 글 작성 화면
server.get('/create.html',function(req,res){
    res.sendFile(__dirname+'/create.html');
})

// 글 읽기 화면
server.get('/read',function(req,res){
    // 게시글 번호 쿼리로 받아오기
    const boardid=req.query.boardid;

    const sql = "SELECT * FROM board WHERE boardid = ?";

    connection.query(sql, [boardid], function(error, result) {
        if (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
            return;
        }

        res.render('read', { items : result });
    });
})

// 수정 화면
server.get('/update',function(req,res){
    // 게시글 번호 쿼리로 받아오기
    const boardid=req.query.boardid;

    const sql = "SELECT boardid FROM board WHERE boardid = ?";

    connection.query(sql, [boardid], function(error, result) {
        if (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
            return;
        }

        res.render('update', { items: result });
    });
})

// 로그인 성공 시 메인 화면
server.post('/login',function(req,res){
    const id=req.body.loginId;
    const pw = req.body.loginPw;
    
    var find = "SELECT id, pw FROM user WHERE id = ? AND pw = ?";
    var paramsF=[id, pw];

    connection.query(find, paramsF, function(err, result){
        if(err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
        }
        // result는 결과셋이 아닌 객체 또는 배열
        if((result.length === 0)){
            console.log("아이디 또는 비밀번호를 다시 확인해주세요.");
        }
        else {
            if(result && result.length > 0){
                var userId=result[0].id;
                req.session.loginId = userId;
                console.log(req.session.loginId);
            }
            console.log("로그인 성공!");
            res.redirect('/list');
        }
    });
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
    const loginId=req.session.loginId;

    const title=req.body.createTitle;
    const contents=req.body.createContents;

    var sql = "INSERT INTO board (title, contents, user_id) VALUES (?, ?, ?)";
    var params=[title, contents, loginId];

    connection.query(sql, params, function (err, result) {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
        }

        console.log("글 작성이 완료되었습니다!");
        res.redirect('/list');
    });
})

// 수정 완료 시 읽기 화면
server.post('/update',function(req,res){
    const boardid=req.query.boardid;
    const loginId=req.session.loginId;
    const title=req.body.updateTitle;
    const contents=req.body.updateContents;

    const sql = "UPDATE board SET title=?, contents=?, user_id=? WHERE boardid=?";

    connection.query(sql, [title, contents, loginId, boardid], function(error, result) {
        if (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.redirect('/read?boardid=' + boardid);
    });
})

server.get('/delete',function(req,res){
    const boardid=req.query.boardid;

    console.log(boardid);

    const sql = "DELETE FROM board WHERE boardid=?";

    connection.query(sql, [boardid], function(error, result){
        if (error){
            console.log(error);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.redirect('list');
    });
})

server.listen(3000);