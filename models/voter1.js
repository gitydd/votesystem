module.exports={
  doSample:function doSample(voterAdd,candidateAdd,callback){ //TEST_ADDRESS=voterAdd;
  console.log('Hello, Bitcoin-Testnet RPC sample2.');
var RPC_USERNAME='admin2'; 
var RPC_PASSWORD='123';
var RPC_HOST="127.0.0.1";
var RPC_PORT=19011;

TEST_PRIVATE_KEY='cTAUfueRoL1HUXasWdnETANA7uRq33BUp3Sw88vKZpo9Hs8xWP82'; 
TEST_WALLET_NAME='TestWallet2';  
MIN_DUST_AMOUNT=10000;  //最小有效交易金额,单位satoshi，即0.00000001 BTC
MIN_TRANSACTION_FEE=10000; //矿工费用的最小金额，单位satoshi

//初始化访问RPC服务接口的对象
var client2 = require('kapitalize')()
client2
    .auth(RPC_USERNAME, RPC_PASSWORD)
    .set('host', RPC_HOST)
    .set({
        port:RPC_PORT
    });

console.log('Hello, Bitcoin-Testnet RPC sample3.');

  

   

   //获取未使用的交易(UTXO)用于构建新交易的输入数据块  
    client2.listunspent(1,9999999,[voterAdd],function(err, array_unspent) {
      if (err) {
       console.log('ERROR[listunspent]:',err);
       return callback(err);
      }        
      console.log('Unspent:', array_unspent);

      var array_transaction_in=[];
      
      var sum_amount=0;
      for(var uu=0;uu<array_unspent.length;uu++){
          var unspent_record=array_unspent[uu];
          if(unspent_record.amount>0){
              sum_amount+=unspent_record.amount*100000000; //注意:因为JS语言缺省不支持64位整数，此处示例程序简单采用32位整数，只能处理交易涉及金额数值不大于0xFFFFFFF即4294967295 satoshi = 42.94967295 BTC。 实际应用程序需留意完善能处理64位整数
              array_transaction_in[array_transaction_in.length]={"txid":unspent_record.txid,"vout":unspent_record.vout};
              
              if( sum_amount > (MIN_DUST_AMOUNT+MIN_TRANSACTION_FEE) )
                break;
          }
      }
      
      //确保新交易的输入金额满足最 小交易条件
      if (sum_amount<MIN_DUST_AMOUNT+MIN_TRANSACTION_FEE){
          var invalid='Invalid unspent amount';
          console.log('Invalid unspent amount');
          return callback(invalid);
      }

      console.log('Transaction_in:', array_transaction_in);

      //生成测试新交易的输出数据块，此处示例是给指定目标测试钱包地址转账一小笔测试比特币"msbo8jrXaNkHu5MkmDNfdRrZAFQVBTECTP"
      //注意：输入总金额与给目标转账加找零金额间的差额即MIN_TRANSACTION_FEE，就是支付给比特币矿工的交易成本费用
      
     
           var obj_transaction_out={};
       
           obj_transaction_out[candidateAdd]=MIN_DUST_AMOUNT/100000000;
           obj_transaction_out[voterAdd]=(sum_amount-MIN_DUST_AMOUNT-MIN_TRANSACTION_FEE)/100000000;
           console.log('Transaction_out:', obj_transaction_out);
      
      //生成交易原始数据包
      client2.createrawtransaction(array_transaction_in,obj_transaction_out,function(err2, rawtransaction) {
          if (err2){
           console.log('ERROR[createrawtransaction]:',err2);
           return callback(err2);
          }
          console.log('Rawtransaction:', rawtransaction);
          
          //签名交易原始数据包
          client2.signrawtransaction(rawtransaction,function(err3, signedtransaction) {
              if (err3){ 
                console.log('ERROR[signrawtransaction]:',err3);
                return callback(err3);
              }
              console.log('Signedtransaction:', signedtransaction);
              
              var signedtransaction_hex_str=signedtransaction.hex;
              console.log('signedtransaction_hex_str:', signedtransaction_hex_str);
              
              //广播已签名的交易数据包
              client2.sendrawtransaction(signedtransaction_hex_str,false,function(err4, sended) { //注意第二个参数缺省为false,如果设为true则指Allow high fees to force it to spend，会在in与out金额差额大于正常交易成本费用时强制发送作为矿工费用(谨慎!)
                  
                  if (err4){ 
                    console.log('ERROR[sendrawtransaction]:',err4);
                    return callback(err4);
                   }
                  console.log('Sended TX:', sended);
                  
                  client2.listaccounts(function(err, account_list) {
                      if (err) return callback(err4);
                      callback(err4,account_list);
                      console.log("Accounts list:\n", account_list); //发送新交易成功后，可以核对下账户余额变动情况
                    });

              });
          });
      });
    });

}
};


//module.exports.test=test;
console.log('Hello, Bitcoin-Testnet RPC vote.');






















