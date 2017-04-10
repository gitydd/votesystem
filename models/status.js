var mongodb = require('./db');

function Status(status) {
	this.flag = 0;
        this.setFlag = function (num) {
           this.flag = num;
        };
        this.getFlag=function (){
            return flag;
        }
};

module.exports = Status;

Status.get = function get(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('users1', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			collection.findOne({name: username}, function(err, doc) {
				mongodb.close();
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

