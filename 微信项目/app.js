const express = require('express');

const sha1 = require('sha1');
const  app = express();



/*
 搭建开发者服务器
 */
const config = {
    appID:'wx9b805dbf44b34b82',
    appsecret:'e20fc9f751d195f17bfb8266892bc90a',
    token:'517200'
};


app.use((req,res,next) =>{
    console.log(req.query);
    //获取请求参数
    const{signature,echostr,timestamp,nonce} = req.query;
    const {token} = config;
//将排序后的参数拼接在一起，并且进行加密
    const str = sha1([timestamp,nonce,token].sort().join(''));

    if(signature === str){
        res.end(echostr);

    }else {
        res.end('error');
    }
});



app.listen(3000, err =>{
    if(!err) console.log('服务器启动成功');
   else  console.log(err);
})




