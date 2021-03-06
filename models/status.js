var mongodbClient=require('mongodb').MongoClient;
var url='mongodb://localhost:27017/microblog';

function Status(status) {
        this.name=status.name;
	this.flag = '';
        this.votes='';
        this.setFlag = function (num) {
           this.flag = num;
        };
        this.setVotes = function (num) {
           this.votes = num;
        };
};

module.exports = Status;

Status.get = function get(name, callback) {
          mongodbClient.connect(url,function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('statuss', function(err, collection) {
			if (err) {
                                 db.close();
				return callback(err);
			}

			collection.findOne({name:name}, function(err, doc) {
                                    db.close();
				if (doc) {
					callback(err, doc);
				} else {
					callback(err, null);
				}
			});
		});
	});
};


//更新
Status.update = function update(name,newnum,newvotes, callback) {
        console.log(name,newnum,newvotes,'update');
           mongodbClient.connect(url,function(err, db) {
		if (err) {                 
			return callback(err);
		}
		db.collection('statuss', function(err, collection) {
			if (err) {    
                                 db.close();
				return callback(err);
			}

			collection.update({name:name}, {$set:{flag:newnum,votes:newvotes}},false,false, function(err, status) {
                                  db.close();
				callback(err, status);
			});
		});
	});
};
