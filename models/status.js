var mongodb = require('./db');

function Status(status) {
        this.name=status.name;
	this.flag = '';
        this.setFlag = function (num) {
           this.flag = num;
        };
};

module.exports = Status;

Status.get = function get(name, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('statuss', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			collection.findOne({name:name}, function(err, doc) {
				mongodb.close();
				if (doc) {
				//	var user1 = new Status(doc);
                                       console.log(doc,'get status');
					callback(err, doc);
				} else {
					callback(err, null);
				}
			});
		});
	});
};


//更新
Status.update = function update(name,newnum, callback) {
        console.log(name,newnum,'update');
	mongodb.open(function(err, db) {
		if (err) {                 
			return callback(err);
		}
		db.collection('statuss', function(err, collection) {
			if (err) {    
				mongodb.close();
				return callback(err);
			}

			collection.update({name:name}, {$set:{flag:newnum}},false,false, function(err, status) {
				mongodb.close();
				callback(err, status);
			});
		});
	});
};

