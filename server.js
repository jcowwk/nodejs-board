// express 모듈을 express 변수에 담기
const express=require('express');
const server=express();

// 검색 시 나오는 화면
server.get('/',function(req,res){
    res.sendFile(__dirname+'/login.html');
})

// 로그인 화면
server.get('/login.html',function(req,res){
    res.sendFile(__dirname+'/login.html');
})

// 로그인 성공 시 메인 화면
server.post('/login',function(req,res){
    res.sendFile(__dirname+'/list.html');
})

// 회원가입 화면
server.get('/join.html',function(req,res){
    res.sendFile(__dirname+'/join.html');
})

// 회원가입 성공 시 로그인 화면
server.post('/join',function(req,res){
    res.sendFile(__dirname+'/login.html');
})

// 메인 화면
server.get('/list.html',function(req,res){
    res.sendFile(__dirname+'/list.html');
})

// 글 작성 화면
server.get('/create.html',function(req,res){
    res.sendFile(__dirname+'/create.html');
})

// 글 작성 완료 시 메인 화면
server.post('/create',function(req,res){
    res.sendFile(__dirname+'/list.html');
})

// 글 읽기 화면
server.get('/read.html',function(req,res){
    res.sendFile(__dirname+'/read.html');
})

// 수정 화면
server.get('/update.html',function(req,res){
    res.sendFile(__dirname+'/update.html');
})

// 수정 완료 시 읽기 화면
server.post('/update',function(req,res){
    res.sendFile(__dirname+'/read.html');
})

server.listen(3000);