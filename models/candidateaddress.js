global.candidateaddress='';
module.exports={
test:function test(){
var RPC_USERNAME='admin1'; 
var RPC_PASSWORD='123';
var RPC_HOST="127.0.0.1";
var RPC_PORT=19001;

console.log('Hello, Bitcoin-Testnet RPC sample.');

var client = require('kapitalize')()
client
    .auth(RPC_USERNAME, RPC_PASSWORD)
    .set('host', RPC_HOST)
    .set({
        port:RPC_PORT
    });


client.getnewaddress(function(err, info) {
  if (err) return console.log(err);
  //console.log('generatenewaddress:', info);
  global.candidateaddress=info;
});
 console.log('generatenewaddress:', global.candidateaddress);
   return global.candidateaddress;
}
};

