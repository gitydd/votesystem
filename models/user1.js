var mongodbClient=require('mongodb').MongoClient;
var url='mongodb://localhost:27017/microblog';
function User1(user1) {
	this.name = user1.name;
	this.address = user1.address;
        this.vote=user1.vote;
        this.setVote = function (vote) {
           this.vote = vote;
        };

};

module.exports = User1;

User1.prototype.save = function save(callback) {
	var user1 = {
		name: this.name,
		address: this.address,
                vote:0,
	};
         mongodbClient.connect(url,function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('users1', function(err, collection) {
			if (err) {
                                db.close();
				return callback(err);
			}

			// collection.ensureIndex('name', {unique: true});


			collection.insert(user1, {safe: true}, function(err, user1) {		
                                 db.close();
				callback(err, user1);
			});
		});
	});
}


/*
 * 查询在集合`users`是否存在一个制定用户名的用户
 * @param {String} username: 需要查询的用户的名字 
 * @param {Function} callback: 执行完数据库操作的应该执行的回调函数
 */

User1.get = function get(username, callback) {
         mongodbClient.connect(url,function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('users1', function(err, collection) {
			if (err) {
                                db.close();
				return callback(err);
			}

			collection.findOne({name: username}, function(err, doc) {
                                db.close();
				if (doc) {

					var user1 = new User1(doc);
					callback(err, user1);
				} else {
					callback(err, null);
				}
			});
		});
	});
};

//讀取

User1.list = function get(candidatename, callback) {
    mongodbClient.connect(url,function(err, db) {
    if (err) {
      return callback(err);
    }
    // 读取 candidates 集合
    db.collection('users1', function(err, collection) {
      if (err) {
         db.close();
        return callback(err);
      }     
      var query = {};
      if (candidatename) {
        query.name = candidatename;
      }
      collection.find(query).toArray(function(err, docs) {
         db.close();
        if (err) {
          callback(err, null);
        }
        var candidates = [];
        docs.forEach(function(doc, index) {
          var candidate = new User1(doc);
          candidates.push(candidate); 
         
        });
        callback(null, candidates);
      });
    });
  });
};


//更新
User1.update = function update(address,newvote, callback) {
        console.log(address,newvote,'1');
         mongodbClient.connect(url,function(err, db) {
		if (err) {                   
			return callback(err);
		}
                console.log(address,newvote,'2');
		db.collection('users1', function(err, collection) {
			if (err) { 
                                db.close();
				return callback(err);
			}
                        console.log(address,newvote,'3');

			collection.update({address:address}, {$set:{vote:newvote}},false,false, function(err, user1) {
                                db.close();
				callback(err, user1);
			});
                       console.log(address,newvote,'4');
		});
	});
};


//remove
User1.delete1 = function delete1(callback) {
         mongodbClient.connect(url,function(err, db) {
		if (err) {                 
			return callback(err);
		}
		db.collection('users1', function(err, collection) {
			if (err) {    
                                db.close();
				return callback(err);
			}

			collection.remove(function(err, result) {
                                db.close();
				callback(err);
			});
		});
	});
};

