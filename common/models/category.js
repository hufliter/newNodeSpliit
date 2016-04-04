var app = require('../../server/server.js');
module.exports = function(Category) {
	Category.remoteMethod('getCategory', {
		description: 'Get Category',
        accepts: [
            { arg: 'language', type: 'string' }
        ],
        returns: {
            arg: 'data', type: 'object'
        },
        http: { status: 200 },
        http: { verb: 'get', errorStatus: 400 }
	});
	Category.getCategory = function(language, next){
		var dataReturn = {};
		Category.find({
			where: {
				active: 1
			}
		}, function(err, data){
			if( err ) return next(null, err);
			if( data && data.length > 0 )  {
				dataReturn = { "status":200, "success":1, "message":"Get Category Success", "data": data };
				return next(null, dataReturn);
			} else {
				dataReturn = { "status":404, "success":0, "message":"Category not found", "data": null  };
				return next(null, dataReturn);
			}
		});
	};
};
