var config = require('../../server/config.json');
var app = require('../../server/server');
var loopback = require('loopback');
var async = require('async');
var path = require('path');
var helper = require('../../server/helper');
var fs = require('fs');
module.exports = function(Deal) {

    // Deal.observe('load', function getCategory(ctx, next) {
    //     console.log(ctx);
    //   if (ctx.instance) {
    //     console.log(ctx.instance);
    //   }
    //   next();
    // });
    Deal.afterRemote('find', function(ctx, user, next) {
        if(ctx.result) {
            ctx.result.forEach(function (result) {
                result.getCategory(function(err, category) {
                    result.categoryObj = category
                });
            });
            var result = [];
            async.eachSeries(ctx.result, function iteratee(item, callback) {
                item.getCategory(function(err, category) {
                    item.category_name = category.label;
                    result.push(item);
                    callback(null, true);
                });
            }, function done() {
                ctx.result = result;
                next();
            });
        } else {
            next();
        }
    });

    Deal.remoteMethod('getDeals', {
        description: 'Get Deals Nearby',
        accepts: [
            { arg: 'category', type: 'string' },
            { arg: 'option', type: 'number' , required: true},
            { arg: 'page', type: 'number' },
            { arg: 'distance', type: 'number' },
            { arg: 'search_key', type: 'string' },
            { arg: 'longitude', type: 'number' },
            { arg: 'latitude', type: 'number' }
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { verb: 'get' }
    });

    Deal.getDeals = function(category, option, page, distance, search_key, longitude, latitude , next) {
        var sharedDeal = app.models.SharedDeal;
        var userModel = app.models.Users;
        var nb_deal_by_page = config.NB_DEAL_BY_PAGE;
        var curDate = helper.getCurrentDateTime();
        var dataReturn = {};

        if( option != 2 ) {
            dataReturn = {"status":404, "success":0, "message":"Option value invalid"};
            return next(dataReturn);
        }

        //for purpose using filter near (loopback)
        if( longitude && latitude ) {
            var geoPoint = loopback.GeoPoint({ "lat":latitude, "lng":longitude });
        } else {
            dataReturn = {"status":404, "success":0, "message":"Missing lng, lat values"};
            return next(dataReturn);
        }

        if( search_key ) {
            var pattern = new RegExp(search_key, "i"); /* case-insensitive RegExp search */
            Deal.find({
                where: {
                    brand: pattern,
                    endDate: { gte: curDate },
                    active: 1
                }
            }, function(err, searchResult) {
                if( err ) return next(null, err);
                if( searchResult && searchResult.length > 0) {

                    var i = 0;
                    searchResult.forEach( function(result, index){
                        sharedDeal.find({
                            where: {
                                idDeal: result.idDeal
                            },
                            include: {
                                relation: 'users',
                                scope: {
                                    fields: ['firstName', 'lastName', 'email', 'avatar', 'mark', 'idCust', 'facebookId'],
                                    include: {
                                        relation: 'usersComments',
                                        scope: {
                                            fields: ['comments', 'mark', 'idCust', 'idOwner', 'idDeal', 'idSDeal'],
                                        }
                                    }
                                }
                            },
                            fields: {
                                idSDeal: true,
                                idDeal: true,
                                idCust: true,
                                customerStatus: true,
                                hasConcluded: true,
                                hasReviewed: true,
                                archive: true,
                                status: true,
                                groupNumber: true,
                                users: true
                            }
                        }, function(err, groupData){
                            if( err ) return next(null, err);
                            if( groupData ) {
                                i++;
                                result.group = groupData;
                                if( i == searchResult.length ) {
                                    dataReturn = { "error":200, "success":1, "message":"List deals", "data":searchResult };
                                     return next(null, dataReturn);
                                }
                            } else {
                                dataReturn = { "status":404, "success": 0, "message":"Deal not found" };
                                return next(null, dataReturn);
                            }
                        });
                    });
                } else {
                    dataReturn = { "status":404, "success":0, "message":"Deal Not Found", "data":null };
                    return next(null, dataReturn);
                }
            });
        } else {
            Deal.find({
                where: {
                    location: {
                        near: geoPoint
                    },
                    active: 1,
                    endDate: { gte: curDate },
                    category: category
                }
            }, function(err, dealData){
                if( err ) return next(err);
                if( dealData.length > 0 ) {
                    var i = 0;
                    dealData.forEach(function(list, index){
                        sharedDeal.find({
                            where: {
                                idDeal: list.id
                            },
                            include: {
                                relation: 'users',
                                scope: {
                                    fields: ['firstName', 'lastName', 'email', 'avatar', 'mark', 'idCust', 'facebookId'],
                                    include: {
                                        relation: 'usersComments',
                                        scope: {
                                            fields: ['comments', 'mark', 'idCust', 'idOwner', 'idDeal', 'idSDeal'],
                                        }
                                    }
                                }
                            }
                        }, function(err, groupData){
                            if( err ) return next(null, err);
                            if( groupData ) {
                                i++;
                                list.group = groupData;
                                if( i == dealData.length ) {
                                    dataReturn = { "status":200, "success":1, "message":"Get list deal success","data":dealData };
                                    return next(null, dataReturn);
                                }
                            } else {
                                dataReturn = { "status":404, "success": 0, "message":"Deal not found" };
                                return next(null, dataReturn);
                            }
                        });
                    });
                } else {
                    return next(null);
                };
            });

            /*var query = '';
            if( category && category != undefined ) {
                query = "SELECT  *, (SQRT((d.longitude - "+longitude+")*(d.longitude - "+longitude+") + (d.latitude - "+latitude+")*(d.latitude - "+latitude+"))) AS distance ," +
                "(select label from category where id_category = d.category) AS category_name FROM  deal as d" +
                " WHERE d.category="+category+" AND CURDATE() < d.end_date AND d.active = 1 ORDER BY distance ASC";
            } else {
                query = "SELECT  *, (SQRT((d.longitude - "+longitude+")*(d.longitude - "+longitude+") + (d.latitude - "+latitude+")*(d.latitude - "+latitude+"))) AS distance ," +
                "(select label from category where id_category = d.category) AS category_name FROM deal d WHERE CURDATE() < d.end_date AND d.active = 1 ORDER BY distance ASC";
            }
            var ds = Deal.dataSource;
            ds.connector.execute(query, function(err, dealData){
                if( err ) next(null, err);
                if(dealData) {
                    var i = 0;
                    dealData.forEach( function(list, index){
                        sharedDeal.find({
                            where: {
                                idDeal: list.id_deal
                            },
                            include: {
                                relation: 'users',
                                scope: {
                                    fields: ['firstName', 'lastName', 'email', 'avatar', 'mark', 'idCust'],
                                    include: {
                                        relation: 'usersComments',
                                        scope: {
                                            fields: ['comments', 'mark', 'idCust', 'idOwner', 'idDeal', 'idSDeal'],
                                        }
                                    }
                                }
                            },
                            fields: {
                                idSDeal: true,
                                idDeal: true,
                                idCust: true,
                                customerStatus: true,
                                hasConcluded: true,
                                hasReviewed: true,
                                archive: true,
                                status: true,
                                groupNumber: true,
                                users: true
                            }
                        }, function(err, groupData){
                            if( err ) return next(null, err);
                            if( groupData ) {
                                i++;
                                list.group = groupData;
                                if( i == dealData.length ) {
                                    dataReturn = { "status":200, "success":1, "message":"Get list deal success","data":dealData };
                                    return next(null, dataReturn);
                                }
                            } else {
                                dataReturn = { "status":404, "success": 0, "message":"Deal not found" };
                                return next(null, dataReturn);
                            }
                        });
                    });
                } else {
                    dataReturn = { "status":404, "success":0, "message": "Deal not found" };
                    return next(null, dataReturn);
                }
            });*/
        }
    };

    Deal.remoteMethod('checkDealExpireById', {
        description: 'Check Deal Expires By Deal Id',
        accepts: [
            { arg: 'id_deal', type: 'number', required: true }
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { verb: 'post' }
    });

    Deal.checkDealExpireById = function(id_deal, next){
        var dataReturn = {};
        var curDate = helper.getCurrentDateTime();
        Deal.findOne({
            where: {
                idDeal: id_deal,
                endDate: { lte: curDate },
                is_system: 1
            }
        }, function(err, dealData){
            if( err ) return next(null, err);
            if( dealData ) {
                dealData.updateAttribute('active', 0 , function(err, result){
                    if( err ) return next(null, err);
                    if( result ) {
                        dataReturn = { 'status':200, 'success':1, 'message': 'Done!' };
                        return next(null, dataReturn);
                    } else {
                        dataReturn = { 'status':404, 'success':0, 'message': 'Oops! Something went wrong' };
                        return next(null, dataReturn);
                    }
                });
            } else {
                dataReturn = { 'status':200, 'success':0, 'message':'Deal still have time' };
                return next(null, dataReturn);
            }
        });
    };

    Deal.observe('after save', function(ctx, next){
        if( ctx.instance ) {
            var sharedDealModel = app.models.SharedDeal;
            var container = app.models.container;

            sharedDealModel.joinDeal(ctx.instance.createdBy, ctx.instance.id, function(err, result){
                if( err ) return next(null, err);
                if( result ) {
                    var pathDir = 'uploads/deal/';
                    var imagePath = ctx.instance.urlImage;
                    var fileName = helper.getFileName(imagePath);
                    fs.rename('uploads/tmp/'+ fileName, pathDir+'/'+ fileName, function(err, result){
                        if( err ) {
                            return next();
                        } else {
                            var newPath = 'containers/deal/download/'+ fileName;
                            Deal.findOne({ where: {
                                id: ctx.instance.id
                            }}, function(err, dealData){
                                if( err ) return next(null, err);
                                if( dealData ) {
                                    dealData.updateAttribute('urlImage', newPath, function(err, updateData){
                                        if( err ) {
                                            return next(null, err);
                                        }
                                        if( updateData ) {
                                            return next();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
    
    //couting Deal Active & Deal Unactive
    Deal.remoteMethod('countUnOrActiveDeal', {
        description: 'Get Deals Nearby',
        accepts: [
            { arg: 'ctx', type: 'string', http: { srouce: 'context' } }
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { verb: 'get' }
    });
    Deal.countUnOrActiveDeal = function(ctx, next){
        var dataReturn = {};
        Deal.count(function(err, totalDeal){
            if( err ) return next(null, err);
            Deal.count({ 
                active: 1
            }, function(err, activeDeal){
                if( err ) return next(null, err);
                var unactiveDeal = totalDeal - activeDeal;
                var resultData = {
                    activeDeal: activeDeal,
                    unactiveDeal: unactiveDeal
                };
                dataReturn = { "status":200, "success":1, "mesasge":"Count success", "data":resultData };
                return next(null, dataReturn);
            });
        });
    };
};
