var mongodb = require('./db');

/*
 * 集合`users`的文档`User`构造函数
 * @param {Object} user: 包含用户信息的一个对象
 */
function User(user) {
	this.name = user.name;
        this.address = user.address;
	this.password = user.password;
        this.vote='';
        this.setAddress = function (address) {
           this.address = address;
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
                vote:'',
	};

	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			// collection.ensureIndex('name', {unique: true});


			collection.insert(user, {safe: true}, function(err, user) {
				mongodb.close();
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
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			collection.findOne({name: username}, function(err, doc) {
				mongodb.close();
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
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			collection.findOne({name: username}, function(err, doc) {
				mongodb.close();
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

//讀取

User.list = function get(votername, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    // 读取 candidates 集合
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }     
      var query = {};
      if (votername) {
        query.name = votername;
      }
      collection.find(query).toArray(function(err, docs) {
        mongodb.close();
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
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			collection.update({name:username}, {$set:{password:newpassword}}, false,false,function(err, user) {
				mongodb.close();
				callback(err, user);
			});
		});
	});
};


//更新
User.update = function update(name,newaddress, callback) {
        console.log(name,newaddress,'1');
	mongodb.open(function(err, db) {
		if (err) {                 
			return callback(err);
		}
		db.collection('users', function(err, collection) {
			if (err) {    
				mongodb.close();
				return callback(err);
			}

			collection.update({name:name}, {$set:{address:newaddress}},false,false, function(err, user) {
				mongodb.close();
				callback(err, user);
			});
		});
	});
};

