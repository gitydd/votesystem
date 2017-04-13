var mongodbClient=require('./db').MongoClient;
var url='mongodb://localhost:27017/microblog';

 mongodbClient.connect(url,function(err, db) {
		if (err) {
			return callback(err);
		}
               console.log("Connected correctly to server");

               db.close();
});
