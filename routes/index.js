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

/*
router.get('/', function(req, res, next) {
  res.render('index', { title: '首页' });
});
*/

//投票流程
router.get('/home', function(req, res,next) {
  res.send('投票流程:输入账号，点击登陆-->勾选要投的候选人（单选）-->点击投票-->退出登陆 ' );
});


//选民投票
router.get('/vote', function(req, res, next) { 
/*  res.render('vote', {
    title: '选民投票',
  });
*/
  
User1.list(null,function(err, user1) {
     if (err) {
       req.flash('error', err);
     return res.redirect('/vote');
     }
     if (!user1) {
       req.flash('error', 'no user');
     return res.redirect('/vote');
     }
     if(req.session.status){
       req.flash('error', '投票已经结束！');
     return res.redirect('/vote');
     }
     res.render('vote',{
       title: '选民投票',
       candidates:user1,
     });
   });

});


router.post('/vote', function(req, res, next) { 
     if(req.session.status){
       req.flash('error', '投票已经结束！');
     return res.redirect('/vote');
     }
     if(req.session.user.name==''){
         req.flash('error', '选民为空');
         res.redirect('/vote'); 
     }
     else if(req.body['radio']==null){
         req.flash('error',req.session.status);
         res.redirect('/vote'); 
     }
     else if(req.session.user.vote!=''){
         req.flash('error', '您已经投过票了，请勿重复投票');
         res.redirect('/vote'); 
     }
     else{
     vote.doSample(req.session.user.name,req.body['radio']);
     req.session.user.vote=req.body['radio']; 
     }
     req.flash('success', '投票成功');
     res.redirect('/vote');  
       
});


//查看投票结果
router.get('/voteresult', function(req, res, next) { 
req.session.status=0;
console.log(req.session.status,'old');
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

router.post('/voteresult', function(req, res, next) {
  req.session.status=1;
  console.log(req.session.status,'new');
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
/*res.render('reg1', {
    title: '注册候选人',
    candidates:'',
  });
 */
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


// 登录页路由
router.get("/login",checkNotLogin);
router.get('/login', function(req, res, next) {
  res.render('login', {
    title: '用户登入',
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
    req.flash('success', '登入成功');
    res.redirect('/');
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
    req.flash('success', '修改成功');
   res.redirect('/repassword');
  });
  
});


// 登录页路由
router.get("/login",checkNotLogin);
router.get('/login', function(req, res, next) {
  res.render('login', {
    title: '用户登入',
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
    req.flash('success', '登入成功');
    res.redirect('/');
  });
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
