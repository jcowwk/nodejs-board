// express 모듈을 express 변수에 담기
const express=require('express');
const server=express();

server.get('/',function(req,res){
    res.sendFile(__dirname+'/login.html');
})

server.listen(3000);