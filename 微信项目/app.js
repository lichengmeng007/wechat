const express = require('express');

const sha1 = require('sha1');

const {getUserDataAsync,parseXMLDataAsync,formatMessage} = require('./utils/tools');
const  app = express();



/*
 搭建开发者服务器
 */
//配置对象
const config = {
    appID:'wx9b805dbf44b34b82',
    appsecret:'e20fc9f751d195f17bfb8266892bc90a',
    token:'517200'
};


app.use( async(req,res,next) =>{
    console.log(req.query);
    //获取请求参数
    const{signature,echostr,timestamp,nonce} = req.query;
    const {token} = config;
//将排序后的参数拼接在一起，并且进行加密
    const str = sha1([timestamp,nonce,token].sort().join(''));

    /*
     1.get 验证服务器有效性逻辑
     2.post转发用户消息
     */
    if(req.method ==='GET'){
        //验证服务器有效性
        if(signature === str){
            //说明来自微信服务器
            res.end(echostr);

        }else {
            res.end('error');
        }

    }else if(req.method ==='POST'){
        //转发用户消息并验证消息来自微信服务器
        if(signature !== str){
            res.end('error');
            return;
        }

        //用户发送的消息在请求体
        const xmlData = await getUserDataAsync(req);
        console.log(xmlData);
        //将用户发送过来的xml数据解析为js对象
        const jsData =  await parseXMLDataAsync(xmlData);
        console.log(jsData);

        //格式化数据
        const message = formatMessage(jsData);

        console.log(message);


        //初始化一个消息文本
        let content = '你在说什么，我听不懂~';

        //判断用户发送消息的内容，根据内容返回特定的响应
        if (message.Content === '1') {  //全匹配
            content = '好好学习，天天向上';
        } else if (message.Content === '2') {
            content = '生活不止眼前的苟且还有诗和远方';
        } else if (message.Content.includes('山')) {  //半匹配
            content = '人说山西好风光~';
        }

        //返回xml消息给微信服务器
        let replyMessage = `<xml>
      <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
      <CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${content}]]></Content>
      </xml>`;
       // 微信服务器当没有接收到开发者服务器响应时，默认会请求3次开发者服务器，就会导致接口被调用多次
       res.send(replyMessage);


    }else {
        res.end('error');
    }

});



app.listen(3000, err =>{
    if(!err) console.log('服务器启动成功');
   else  console.log(err);
})




