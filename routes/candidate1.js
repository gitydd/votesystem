//对应比特币测试网络(Bitcoin testnet)的RPC服务接口访问参数
//this.result11='55';
//this.result22=global.result2;
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
global.result1='';
global.result2='';
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
   //console.log('receiveaddressinfo:', info);
 // for(var i=0;i<info.length;i++){
   //  console.log('candidate',i+1,':',info[i].address);
     //console.log('voters:',info[i].amount*10000);
     global.result1=info[0].amount*10000;
     global.result2=info[1].amount*10000;
    console.log('Hello, Bitcoin-Testnet RPC voteresult2.');
    console.log(global.result1,global.result2);
  //  return result1;
    // return result1,result2;
 // }
});
  //return global.result1;
}
};

//console.log('Hello, Bitcoin-Testnet RPC voteresult3.');
//查看当前钱包下属地址账户余额变动情况
/*client.listaccounts(function(err, account_list) {
  if (err) return console.log(err);
  console.log("Accounts list:\n", account_list);
});
*/





