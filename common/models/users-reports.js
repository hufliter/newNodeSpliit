module.exports = function(UsersReports) {
    UsersReports.remoteMethod('reportUser', {
        description: 'Report User',
        accepts: [
            { arg: 'id_cust', type: 'string', required: true },
            { arg: 'id_deal', type: 'string', required: true },
            { arg: 'selected_id_cust', type: 'string', required: true }
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { verb: 'post', errorStatus: 400 }
    });
    UsersReports.reportUser = function(id_cust, id_deal, selected_id_cust, next){
        var dataReturn = {};
        UsersReports.findOne({
            where :{
                idOwner: selected_id_cust,
                idDeal: id_deal,
                isReporting: 1
            }
        }, function(err, uReport){
            if( err ) return next(null, err);
            if( uReport ) {
                dataReturn = { "status":404, "success":0, "message":"You have report this user before" };
                return next(null, dataReturn);
            } else {
                var data = {
                    idCust: id_cust,
                    idDeal: id_deal,
                    idOwner: selected_id_cust,
                    isReporting: 1
                };
                UsersReports.create(data, function(err, result){
                    if( err ) return next(null, err);
                    if( result ) {
                        dataReturn = { "status":200 , "success":1 , "message":"Report Success" };
                        return next(null, dataReturn);
                    } else {
                        dataReturn = { "status":404 , "success":0 , "message":"Oops! Something went wrong" };
                        return next(null, dataReturn);
                    }
                });
            }
        });
    };

    //disable Method
    // UsersReports.disableRemoteMethod("create", true);
    // UsersReports.disableRemoteMethod("upsert", true);
    // UsersReports.disableRemoteMethod("updateAll", true);
    // UsersReports.disableRemoteMethod("updateAttributes", true);

    // UsersReports.disableRemoteMethod("find", true);
    // UsersReports.disableRemoteMethod("findById", true);
    // UsersReports.disableRemoteMethod("findOne", true);

    // UsersReports.disableRemoteMethod("deleteById", true);

    // UsersReports.disableRemoteMethod('__count__accessTokens', true);
    // UsersReports.disableRemoteMethod('__create__accessTokens', true);
    // UsersReports.disableRemoteMethod('__delete__accessTokens', true);
    // UsersReports.disableRemoteMethod('__destroyById__accessTokens', true);
    // UsersReports.disableRemoteMethod('__findById__accessTokens', true);
    // UsersReports.disableRemoteMethod('__get__accessTokens', true);
    // UsersReports.disableRemoteMethod('__updateById__accessTokens', true);

    // UsersReports.disableRemoteMethod('createChangeumhStream', true);
};
