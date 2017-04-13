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


var express = require('express'),
 	router = express.Router(),
 	crypto = require('crypto'),
 	User = require('../models/user.js'),
        User1 = require('../models/user1.js'),
        Status = require('../models/status.js'),
 	Post = require("../models/post.js"),
        vote=require('../models/voter1.js'),
        candidateaddress=require('../models/candidateaddress.js'),
        voteraddress=require('../models/voteraddress.js'),
        candidate=require('../models/candidate1.js');
var http=require('http');
/*主页路由 */
router.get('/', function(req, res,next) {
	Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
            
		res.render('index', {
			title: '首页',
			posts: posts,
			user : req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString()
		});
	});
});


//投票流程
router.get('/home', function(req, res,next) {
  res.send('投票流程:输入账号，点击登陆-->勾选要投的候选人（单选）-->点击投票-->退出登陆 ' );
});


//结束投票

router.post('/votestop',function(req,res,next){
    Status.update("status",0,0,function(err,status){
        if (err) {
               req.flash('error', err);
               return res.redirect('/voteresult');
            }  
      // res.redirect('/voteresult');  
   }); 
   req.flash('success', '结束投票');
   res.redirect('/voteresult'); 
});


//开启投票

router.post('/votestart',function(req,res,next){
   console.log(req.body.votes,'everyone votes');
    Status.update("status",1,req.body.votes,function(err,status){
        if (err) {
               req.flash('error', err);
               return res.redirect('/voteresult');
            }  
      //res.redirect('/voteresult'); 
     });
    
  req.flash('success', '开启投票');
  res.redirect('/voteresult');
});


//选民投票
router.get('/vote', function(req, res, next) { 
  
User1.list(null,function(err, user1) {
     if (err) {
       req.flash('error', err);
     return res.redirect('/vote');
     }
     if (!user1) {
       req.flash('error', 'no user');
     return res.redirect('/vote');
     }
     res.render('vote',{
       title: '选民投票',
       candidates:user1,
     });
   });

});


router.post('/vote', function(req, res, next) { 
     if(req.session.user.name==''){
         req.flash('error', '选民为空');
         res.redirect('/vote'); 
     }
     else if(req.body['checkbox']==null){
         req.flash('error','候选人为空');
         res.redirect('/vote'); 
     }
     else if(req.body['checkbox'].length>req.session.user.votes){
         req.flash('error','对不起，您只有'+req.session.user.votes+'票,请重新选择!');
         res.redirect('/vote'); 
     }
     else{
       for(var i=0;i<req.body['checkbox'].length;i++){
           vote.doSample(req.session.user.address,req.body['checkbox'][i]);
       } 
       req.flash('success', '投票成功');
       res.redirect('/vote'); 
     }
       
});


//管理员查看投票结果
router.get('/voteresult', function(req, res, next) { 
User1.list(null, function(err, user1) {
      if (err) {
        user1 = [];
      }
      
       var voteinfo = []; 
       var candidateswithamount = [];
       client.listreceivedbyaddress(function(err, info) {
         if (err) return console.log(err); 
         info.forEach(function(addressinfo, index1) {
            user1.forEach(function(candidate, index2) {
               if(candidate.address===addressinfo.address){                 
                  candidate.setVote(addressinfo.amount*10000);
               } 
             });             
         });

        res.render('voteresult', {
            title:  '投票结果',
            candidates:user1                                      
          });
       });
 
    });

});
//选民查看投票结果
router.get('/voteresult1', function(req, res, next) {
  User1.list(null, function(err, user1) {
      if (err) {
        user1 = [];
      }
      
       var voteinfo = []; 
       var candidateswithamount = [];
       client.listreceivedbyaddress(function(err, info) {
         if (err) return console.log(err); 
         info.forEach(function(addressinfo, index1) {
            user1.forEach(function(candidate, index2) {
               if(candidate.address===addressinfo.address){                 
                  candidate.setVote(addressinfo.amount*10000);
               } 
             });             
         });

        res.render('voteresult1', {
            title:  '投票结果',
            candidates:user1                                      
          });
       });
 
    }); 
});
// 注册选民页路由
router.get('/reg', function(req, res, next) {
 res.render('reg', { title: '注册选民' });
});
router.post('/reg', function(req, res, next) {
   //检验用户两次输入的口令是否一致
   if (req.body['password-repeat'] != req.body['password']) {
     req.flash('error', '两次输入的口令不一致');
     return res.redirect('/reg');
   }
   //生成口令的散列值
   var md5 = crypto.createHash('md5');
   var password = md5.update(req.body.password).digest('base64');
   var newUser = new User({
     name: req.body.username,
     address:'',
     password: password,
     vote:'',
   });
   //检查用户名是否已经存在
   User.get(newUser.name, function(err, user) {
     if (user)
       err = 'Username already exists.';
     if (err) {
       req.flash('error', err);
     return res.redirect('/reg');
   }
   //如果不存在则新增用户
   newUser.save(function(err) {
     if (err) {
       req.flash('error', err);
       return res.redirect('/reg');
     }
   req.session.user = newUser;
   req.flash('success', '注册成功');
   res.redirect('/reg');
   });
  });
});


// 注册候选人路由
router.get('/reg1', function(req, res, next) {
User1.list(null,function(err, user1) {
     if (err) {
       req.flash('error', err);
     return res.redirect('/reg1');
     }
     if (!user1) {
       req.flash('error', 'no user');
     return res.redirect('/reg1');
     }
     res.render('reg1',{
       title: '注册候选人',
       candidates:user1,
     });
   });

});

router.post('/reg1', function(req, res, next) {
   var address=candidateaddress.test();
   var newUser1 = new User1({
     name: req.body.username,
     address: address,
   });
   if(address==''){
   req.flash('error', '注册失败，请再次尝试');
     return res.redirect('/reg1');
   }
   //检查用户名是否已经存在
   User1.get(newUser1.name, function(err, user1) {
     if (user1)
       err = 'Username already exists.';
     if (err) {
       req.flash('error', err);
     return res.redirect('/reg1');
   }
   //如果不存在则新增用户
  newUser1.save(function(err) {
     if (err) {
       req.flash('error', err);
     return res.redirect('/reg1');
   }

  User1.list(null,function(err, user1) {
     if (err) {
       req.flash('error', err);
     return res.redirect('/reg1');
     }
     if (!user1) {
       req.flash('error', 'no user');
     return res.redirect('/reg1');
     }
     res.render('reg1',{
       title: '注册候选人',
       candidates:user1,
     });
   });

  req.flash('success', '注册成功');
   res.redirect('/reg1');
   });
  });

});


//分配地址和选票
//router.get("/makevoteraddress",checkLogin);
router.get('/makevoteraddress',function(req,res,next){
  User.get(req.query.votername,function(err,user){
     if(user.address!=''){
       req.flash('error', '已经分配过了，请勿重复分配！');
       return res.redirect('/managevoter');
     }
     else{
      voteraddress.test(function(address){
        User.addAddress(req.query.votername,address,function(err,user){
       
          User.update(user.name,user.address,function(err,user){
            if (err) {
               req.flash('error', err);
               return res.redirect('/managevoter');
            }     
          
          }); 

          client.sendtoaddress(user.address,10,function(err) {
              console.log('sendto address');
              if (err) {
               req.flash('error', err);
               return res.redirect('/managevoter');
              }      
          }); 
          res.redirect('/managevoter');
        });
       
      });
     }
   });
});

//管理选民
//router.get("/managevoter",checkNotLogin);
router.get('/managevoter', function(req, res, next) {
 User.list(null,function(err, user1) {
     if (err) {
       req.flash('error', err);
     return res.redirect('/managevoter');
     }
     if (!user1) {
       req.flash('error', 'no user');
     return res.redirect('/managevoter');
     }
     res.render('managevoter',{
       title: '管理选民',
       votes:user1,
     });
   });

});

// 登录页路由
router.get("/login",checkNotLogin);
router.get('/login', function(req, res, next) {
  res.render('login', {
    title: '用户登入',
    status:'',
  });
});
router.post("/login",checkNotLogin);
router.post('/login', function(req, res, next) {
  //生成口令的散列值
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  User.get(req.body.username, function(err, user) {
    if (!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/login');
    }
    if (user.password != password) {
      req.flash('error', '用户口令错误');
      return res.redirect('/login');
    }
    req.session.user = user;
    Status.get("status",function(err,status){
             if(err){
               req.flash('error', err);
               return res.redirect('/');
             }
             console.log(status.flag,'loginstatus 1');
             user.setStatus(status.flag);
     
             console.log(status.votes,'loginstatus 2');
             user.setVotes(status.votes);
             console.log(req.session.user);
    
      req.flash('success', '登入成功');
      res.redirect('/');
    });
  });

});



//修改密码
router.get('/repassword', function(req, res, next) {
 res.render('repassword', { title: '修改密码' });
});
router.post('/repassword', function(req, res, next) {
   //检验用户两次输入的口令是否一致
   if (req.body['password-repeat'] != req.body['password']) {
     req.flash('error', '两次输入的口令不一致');
     return res.redirect('repassword');
   }
  
   //生成口令的散列值
   var md5 = crypto.createHash('md5');
   var password = md5.update(req.body.password).digest('base64');

   User.change(req.session.user.name,password, function(err, user) {
    if (err) {
      req.flash('error',err);
      console.log(err);
      return res.redirect('/repassword');
    }
   
  });
   req.flash('success', '修改成功');
   res.redirect('/repassword');
});



// 退出登录页路由
router.get("/logout",checkLogin);
router.get('/logout', function(req, res, next) { 
  req.session.user = null;
  req.flash('success', '退出成功');
  res.redirect('/');
});





function checkLogin(req, res, next) {
	if (!req.session.user) {
		req.flash('error', '未登入');
		return res.redirect('/login');
	}
	next();
}
function checkNotLogin(req, res, next) {
	if (req.session.user) {
		req.flash('error', '已登入');
		return res.redirect('/');
	}
	next();
}

/*exports.index = function(req, res) {
res.render('index', { title: 'Express' });
};
*/

module.exports = router;
