var express = require('express'),
 	router = express.Router(),
 	crypto = require('crypto'),
 	User = require('../models/user.js'),
        User1 = require('../models/user1.js'),
 	Post = require("../models/post.js"),
        vote=require('../models/voter1.js'),
        candidateaddress=require('../models/candidateaddress.js'),
        candidate=require('../models/candidate1.js');
var http=require('http');
//对应比特币测试网络(Bitcoin testnet)的RPC服务接口访问参数
//global.result=['0','0'];
global.address=[];
global.amount=[];
//global.result=[];
module.exports={
test1:function test1(){
console.log('Hello, Bitcoin-Testnet RPC voteresult7.');
},
test:function test(){
console.log('Hello, Bitcoin-Testnet RPC voteresult1.');
var RPC_USERNAME='admin1'; 
var RPC_PASSWORD='123';
var RPC_HOST="127.0.0.1";
var RPC_PORT=19001;

//初始化访问RPC服务接口的对象
var client = require('kapitalize')()
client
    .auth(RPC_USERNAME, RPC_PASSWORD)
    .set('host', RPC_HOST)
    .set({
        port:RPC_PORT
    });

client.listreceivedbyaddress(function(err, info) {
  if (err) return console.log(err);

  /*
   info.forEach(function(info){
     var address=JSON.stringify(info.address);
    var amount=JSON.stringify(info.amount*10000);
    User1.update(address,amount,function(err, user1) {
    if (err) return console.log(err);
    });
   });
   */

/*
   var address=JSON.stringify(info[2].address);
    var amount=JSON.stringify(info[2].amount*10000);
    User1.update(address,amount,function(err, user1) {
    if (err) return console.log(err);
    });
*/

 for(var i=0;i<info.length;i++){
    global.address[i]=JSON.stringify(info[i].address);
    global.amount[i]=JSON.stringify(info[i].amount*10000); 
  }
  console.log(global.address,global.amount,'old');

/*
 for(var i=0;i<info.length;i++){
    User1.update(global.address[i],global.amount[i],function(err, user1) {
    if (err) return console.log(err);
    });
  }
*/

 });
}

}
console.log('Hello, Bitcoin-Testnet RPC voteresult3.');

//console.log(global.address,global.amount);
//console.log(global.address,global.vote,'1');
//console.log(global.result,'1');
//查看当前钱包下属地址账户余额变动情况
/*client.listaccounts(function(err, account_list) {
  if (err) return console.log(err);
  console.log("Accounts list:\n", account_list);
});
*/




