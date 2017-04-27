var mongodbClient=require('mongodb').MongoClient;
var url='mongodb://localhost:27017/microblog';

/*
 * 集合`users`的文档`User`构造函数
 * @param {Object} user: 包含用户信息的一个对象
 */
function User(user) {
	this.name = user.name;
        this.address = user.address;
	this.password = user.password;
        this.identity='voter';
        this.votes=user.votes;
        this.status=user.status;
        this.setAddress = function (address) {
           this.address = address;
        };
        this.setStatus = function (status) {
           this.status = status;
        };
        this.setVotes = function (votes) {
           this.votes = votes;
        };
};

module.exports = User;

/*
 * 保存一个用户到数据库
 * @param {Function} callback: 执行完数据库操作的应该执行的回调函数
 */
User.prototype.save = function save(callback) {
	var user = {
		name: this.name,
                address:this.address,
		password: this.password,
                votes:'',
                status:'',
                identity:'voter',
	};

        mongodbClient.connect(url,function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('users', function(err, collection) {
			if (err) {
                                   db.close();
				return callback(err);
			}
			collection.insert(user, {safe: true}, function(err, user) {	
                                   db.close();
				callback(err, user);
			});
		});
	});
}


/*
 * 查询在集合`users`是否存在一个制定用户名的用户
 * @param {String} username: 需要查询的用户的名字 
 * @param {Function} callback: 执行完数据库操作的应该执行的回调函数
 */
User.get = function get(username, callback) {
         mongodbClient.connect(url,function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('users', function(err, collection) {
			if (err) {
                               db.close();
				return callback(err);
			}

			collection.findOne({name: username}, function(err, doc) {
                                db.close();
				if (doc) {

					var user = new User(doc);
					callback(err, user);
				} else {
					callback(err, null);
				}
                                
			});
		});
	});
};

//addAddress
User.addAddress = function addAddress(username,newaddress, callback) {
         mongodbClient.connect(url,function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('users', function(err, collection) {
			if (err) {
                                db.close();
				return callback(err);
			}

			collection.findOne({name: username}, function(err, doc) {
                                db.close();
				if (doc) {        
					var user = new User(doc);     
                                        user.setAddress(newaddress);
					callback(err, user);
				} else {
					callback(err, null);
				}
			});
		});
	});
};


//addVotes
User.addVotes = function addVotes(username,newvotes, callback) {
         mongodbClient.connect(url,function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('users', function(err, collection) {
			if (err) {
                                db.close();
				return callback(err);
			}

			collection.findOne({name: username}, function(err, doc) {
                                db.close();
				if (doc) {        
					var user = new User(doc);     
                                        user.setVotes(newvotes);
					callback(err, user);
				} else {
					callback(err, null);
				}
			});
		});
	});
};

//讀取

User.list = function get(votername, callback) {
    mongodbClient.connect(url,function(err, db) {
    if (err) {
      return callback(err);
    }
    // 读取 candidates 集合
    db.collection('users', function(err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }     
      var query = {};
      if (votername) {
        query.name = votername;
      }
      collection.find(query).toArray(function(err, docs) {
        db.close();
        if (err) {
          callback(err, null);
        }
        var voters = [];
        docs.forEach(function(doc, index) {
          var voter = new User(doc);
          voters.push(voter); 
         
        });
        callback(null, voters);
      });
    });
  });
};


/*修改密码*/
User.change = function change(username,newpassword, callback) {
          mongodbClient.connect(url,function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('users', function(err, collection) {
			if (err) {
                                db.close();
				return callback(err);
			}

			collection.update({name:username}, {$set:{password:newpassword}}, false,false,function(err, user) {
                                db.close();
				callback(err, user);
			});
		});
	});
};


//更新address
User.update = function update(name,newaddress, callback) {
        console.log(name,newaddress,'1');
         mongodbClient.connect(url,function(err, db) {
		if (err) {                 
			return callback(err);
		}
		db.collection('users', function(err, collection) {
			if (err) {    
                                db.close();
				return callback(err);
			}

			collection.update({name:name}, {$set:{address:newaddress}},false,false, function(err, user) {
                                db.close();
				callback(err, user);
			});
		});
	});
};


//更新vote
User.updatevote = function updatevote(name,newvote, callback) {
        console.log(name,newvote,'1');
         mongodbClient.connect(url,function(err, db) {
		if (err) {                 
			return callback(err);
		}
		db.collection('users', function(err, collection) {
			if (err) {    
                                db.close();
				return callback(err);
			}

			collection.update({name:name}, {$set:{votes:newvote}},false,false, function(err, user) {
                                 db.close();
				callback(err, user);
			});
		});
	});
};


//remove
User.delete1 = function delete1(callback) {
	mongodbClient.connect(url,function(err, db) {
		if (err) {                 
			return callback(err);
		}
		db.collection('users', function(err, collection) {
			if (err) {    
				db.close();
				return callback(err);
			}

			collection.remove({identity:'voter'},function(err, result) {
				db.close();
				callback(err);
			});
		});
	});
};

