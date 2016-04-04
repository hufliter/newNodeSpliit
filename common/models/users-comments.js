var app = require('../../server/server');
module.exports = function(UsersComments) {

    UsersComments.remoteMethod('getCommentByUid', {
        description: 'Get Comment By User Id',
        accepts: [
            { arg: 'selected_id_cust', type: 'string', required: true }
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { verb: 'get', errorStatus: 400 }
    });
    UsersComments.getCommentByUid = function( selected_id_cust, next ){
        var dataReturn = {};
        var userModel = app.models.Users;
        UsersComments.find({
            where: {
                idOwner: selected_id_cust
            },
            order: 'creationDate DESC'
        }, function(err, comments){
            if( err ) return next(null, err);
            if( comments.length > 0 ) {
                var i = 0;
                comments.forEach(function(comment){
                    userModel.findOne({
                        where: {
                            id: comment.idCust
                        },
                        fields: ['id', 'firstName', 'lastName', 'avatar', 'mark', 'facebookId']
                    }, function(err, uData){
                        i++;
                        if( err ) return next(null, err);
                        if( uData ) {
                            comment.user_first_name = uData.firstName,
                            comment.user_last_name = uData.lastName,
                            comment.mark = uData.mark,
                            comment.user_url_image = uData.avatar,
                            comment.facebookId = uData.facebookId
                            if( comments.length == i ) {
                                dataReturn = { "status":200, "success":1, "message":"Get list comments success", "data":comments };
                                return next(null, dataReturn);
                            }
                        }
                    });
                });
            } else {
                dataReturn = { "status":404, "success":0, "message":"Comments not found", "data":null };
                return next(null, dataReturn);
            }
        });
    };

    UsersComments.remoteMethod('countUserComments', {
        description: 'Count Total Message Received',
        accepts: [
            { arg: 'selected_id_cust', type: 'string', required: true }
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { verb: 'get', errorStatus: 400 }
    });
    UsersComments.countUserComments = function(selected_id_cust, next){
        var dataReturn = {};
        UsersComments.find({
            where: {
                idOwner: selected_id_cust
            }
        }, function(err, result){
            if( err ) return next(null, err);
            if( result.length > 0 ) {
                dataReturn = { 'status':200, 'success':1, 'message':'Count Success', 'totalReviews':result.length };
                return next(null, dataReturn);
            } else {
                dataReturn = { 'status':404, 'success':0, 'message':'There is no review', 'totalReviews': 0 };
                return next(null, dataReturn);
            }
        });
    };
};
