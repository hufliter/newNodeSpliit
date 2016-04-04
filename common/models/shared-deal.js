var app = require('../../server/server.js');
var loopback = require('loopback');
var path = require('path');
var configEmail = require('../../server/config_email.json');
module.exports = function(SharedDeal) {
    SharedDeal.getDealGroupInfo = function(id_deal, next){
        SharedDeal.findOne({
            where: {
                idDeal: id_deal,
                groupNumber: 1
            }
        }, function(err, result){
            if( err ) return next(err);
            if( result ) {
                return next(null, result);
            } else {
                return next(null);
            }
        });
    };

    //Join deal
    SharedDeal.remoteMethod('joinDeal', {
        description: 'Join Deal',
        accepts: [
            { arg: 'id_cust', type: 'string', required: true },
            { arg: 'id_deal', type: 'string', required: true }
        ],
        returns: {
            arg: 'data', type: 'object'
        },
        http: { status: 200 },
        http: { verb: 'post', errorStatus: 400 }
    });

    SharedDeal.joinDeal = function(id_cust, id_deal, next){
        var Deal = app.models.Deal;
        var DealGroup = app.models.DealGroup;
        var dataReturn = {};
        Deal.findOne({
            where: {
                id: id_deal,
                endDate: { gte: new Date() }
            }
        }, function(err, deal){
            if( err ) return next(null, err);
            if( deal ) {
                //check this deal has exist in shared deal yet
                SharedDeal.find({
                    where: {
                        idDeal: deal.id
                    }
                }, function(err, sDeal){
                    if( err ) return next(null, err);
                    if( sDeal && sDeal.length > 0 ) {
                        //get info from group_deal
                        //check total participant in this deal is greater than group_deal
                        if( sDeal.length >= deal.nbRequiredCust ) {
                            dataReturn = { "status":404, "success":0, "message":"Deal has full" };
                            return next(null, dataReturn);
                        } else {
                            //get group info
                            //add new shared_deal
                            SharedDeal.findOne({
                                where: {
                                    idDeal: deal.id,
                                    idCust: id_cust
                                }
                            }, function(err, sDeal){
                                if( err ) return next(null,err);
                                if( sDeal ) {
                                    dataReturn = { "status":404, "success":0, "message":"You have joined this deal" };
                                    return next(null, dataReturn);
                                } else {
                                    DealGroup.findOne({ where: { idDeal: deal.id } }, function(err, group){
                                        if( err ) return next(null, err);
                                        if( group ){
                                            //add new shared deal
                                            var sharedDealData = {
                                                idDeal: deal.id,
                                                idCust: id_cust,
                                                status: 'INCOMPLETE',
                                                customerStatus: 0,
                                                hasConcluded: 0,
                                                hasReviewed: 0,
                                                archive: 0,
                                                groupNumber: 1,
                                                creationDate: new Date(),
                                                lastModifiedDate: new Date()
                                            };
                                            SharedDeal.create(sharedDealData, function(err, sharedDeal){
                                                if( err ) return next(null, err);
                                                if( sharedDeal ) {
                                                    //update Group attribute current_nb_cust
                                                    var curCust = group.currentNbCust + 1;
                                                    group.updateAttribute('currentNbCust', curCust, function(err, data){
                                                        if( err ) return next(null, err);
                                                        if( data.currentNbCust == deal.nbRequiredCust ) {
                                                            //update all shared_deal status INCOMPLETE to COMPELTE
                                                            var sDealUpdate = {
                                                                status: "COMPLETE",
                                                                lastModifiedDate: new Date()
                                                            };
                                                            SharedDeal.updateAll({ idDeal: deal.id }, sDealUpdate , function(err, sDealInfo){
                                                                if( err ) return next(null, err);
                                                                //update group status
                                                                group.updateAttribute('status', 1, function(err, data){
                                                                    if( err ) return next(null, err);
                                                                    //send email to notify user
                                                                    //1. gathering email user
                                                                    SharedDeal.find({
                                                                        where: {
                                                                            idDeal: data.idDeal
                                                                        },
                                                                        include: {
                                                                            relation: 'users',
                                                                            scope: {
                                                                                fields: ['email']
                                                                            }
                                                                        }
                                                                    }, function(err, uData){
                                                                        if( err ) return next(null, err);
                                                                        //2. sending email to notify user that deal has reach new phase
                                                                        var i = 0;
                                                                        var message = {
                                                                            heading: configEmail.phase_config.head,
                                                                            text: configEmail.phase_config.pending.message
                                                                        };
                                                                        var renderer = loopback.template(path.resolve(__dirname, '../../server/views/notify_new_phase_email.ejs'));
                                                                        var html_body = renderer(message);
                                                                        uData.forEach(function(list, index){
                                                                            i++;
                                                                            var u = list.toJSON();
                                                                            SharedDeal.app.models.Email.send({
                                                                                to: u.users.email,
                                                                                from: configEmail.phase_config.send_from,
                                                                                subject: configEmail.phase_config.noreply,
                                                                                html: html_body
                                                                            });
                                                                            if( uData.length == i ) {
                                                                                dataReturn = { "status":200, "success":1, "message":"Join deal Success", "data":data };
                                                                                return next(null, dataReturn);
                                                                            }
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        } else {
                                                            dataReturn = { "status": 200, "success":1, "message":"Join deal success", "data": data};
                                                            return next(null, dataReturn);
                                                        }
                                                    });
                                                } else {
                                                    dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                                                    return next(null, dataReturn);
                                                }
                                            });
                                        } else {
                                            dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                                            return next(null, dataReturn);
                                        }
                                    });
                                }
                            });
                        }
                    } else {
                        //this shared deal total empty
                        //create new group_deal
                        //join deal
                        var groupData = {
                            requiredNbCust: deal.nbRequiredCust,
                            currentNbCust: 1,
                            groupNumber: 1,
                            idDeal: deal.id,
                            status: 0,
                            concluded: 0,
                            reviewed: 0,
                            archived: 0
                        };
                        DealGroup.create(groupData, function(err, group){
                            if( err ) return next(null, err);
                            if( group ) {
                                var sharedDealData = {
                                    idDeal: deal.id,
                                    idCust: id_cust,
                                    status: 'INCOMPLETE',
                                    customerStatus: 0,
                                    hasConcluded: 0,
                                    hasReviewed: 0,
                                    archive: 0,
                                    groupNumber: 1,
                                    creationDate: new Date(),
                                    lastModifiedDate: new Date()
                                };
                                SharedDeal.create(sharedDealData, function(err, sharedDeal){
                                    if( err ) return next(null, err);
                                    if( sharedDeal ) {
                                        dataReturn = { "code":200, "success":1 , "message":"Join deal success", "data": sharedDeal };
                                        return next(null, dataReturn);
                                    } else {
                                        dataReturn = { "code":404, "success":0 , "message":"Oops! Something went wrong" };
                                        return next(null, dataReturn);
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                dataReturn = { "status":404, "success":1, "message":"Deal not found or expires" };
                return next(null, dataReturn);
            }
        });
    };

    //Valid deal
    SharedDeal.remoteMethod('validDeal', {
        description: 'Valid Deal',
        accepts: [
            { arg: 'id_cust', type: 'string', required: true },
            { arg: 'id_deal', type: 'string', required: true }
        ],
        returns: {
            arg: 'data', type: 'object'
        },
        http: { status: 200 },
        http: { verb: 'post', errorStatus: 400 }
    });
    SharedDeal.validDeal = function(id_cust, id_deal, next){
        var DealGroup = app.models.DealGroup;
        var dataReturn = {};
        //check deal group status is valid yet?
        DealGroup.findOne({
            where: {
                idDeal: id_deal,
                status: 1
            }
        }, function(err, dealGroup){
            if( err ) return next(null, err);
            if( dealGroup ) {
                SharedDeal.findOne({
                    where: {
                        idDeal: id_deal,
                        idCust: id_cust,
                        status: "COMPLETE",
                        customerStatus: 0
                    }
                }, function(err, sDeal){
                    if( err ) return next(null, err);
                    if( sDeal ) {
                        sDeal.updateAttribute('customerStatus', 1, function(err, dealData){
                            if( err ) return next(null, err);
                            if( dealData ) {
                                //check deal has all valid yet
                                SharedDeal.find({
                                    where: {
                                        idDeal: id_deal,
                                        customerStatus: 1,
                                        status: "COMPLETE"
                                    }
                                }, function(err, sDeal){
                                    if( err ) return next(null, err);
                                    if( sDeal.length == dealGroup.requiredNbCust ) {
                                        //update deal group
                                        //gathering email participant and send notify email
                                        dealGroup.updateAttribute('status', 2, function(err, group){
                                            if(err) return next(null, err);
                                            if( group ) {
                                                SharedDeal.find({
                                                    where: {
                                                        idDeal: id_deal
                                                    },
                                                    include: {
                                                        relation: 'users',
                                                        scope: {
                                                            fields: ['email']
                                                        }
                                                    }
                                                }, function(err, uData){
                                                    if( err ) return next(null, err);
                                                    var i = 0;
                                                    var message = {
                                                        heading: configEmail.phase_config.head,
                                                        text: configEmail.phase_config.confirmation.message
                                                    };
                                                    var renderer = loopback.template(path.resolve(__dirname, '../../server/views/notify_new_phase_email.ejs'));
                                                    var html_body = renderer(message);
                                                    uData.forEach(function(list, index){
                                                        i++;
                                                        var u = list.toJSON();
                                                        SharedDeal.app.models.Email.send({
                                                            to: u.users.email,
                                                            from: configEmail.phase_config.send_from,
                                                            subject: configEmail.phase_config.noreply,
                                                            html: html_body
                                                        });
                                                        if( uData.length == i ) {
                                                            dataReturn = { "status":200, "success":1, "message":"Valid deal Success", "data":dealData };
                                                            return next(null, dataReturn);
                                                        }
                                                    });
                                                });
                                            } else {
                                                dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                                                return next(null, dataReturn);
                                            }
                                        });
                                    } else {
                                        dataReturn = { "status":200, "success":1, "message":"Valid deal Successful", "data":dealData };
                                        return next(null, dataReturn);
                                    }
                                });
                            } else {
                                dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                                return next(null, dataReturn);
                            }
                        });
                    } else {
                        dataReturn = { "status":404, "success":0, "message":"User has valid this deal Or Deal not found" };
                        return next(null,dataReturn);
                    }
                });
            } else {
                dataReturn = { "status":404, "success":0, "message":"Deal Group not found" };
                return next(null, dataReturn);
            }
        });
    };

    //Leave deal
    SharedDeal.remoteMethod('leaveDeal', {
        description: 'Leave Deal',
        accepts: [
            { arg: 'id_cust', type: 'string', required: true },
            { arg: 'id_deal', type: 'string', required: true }
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { verb: 'delete', errorStatus: 400 }
    });
    SharedDeal.leaveDeal = function(id_cust, id_deal, next){
        var dataReturn = {};
        var DealGroup = app.models.DealGroup;
        //check that deal has exist
        SharedDeal.findOne({
            where: {
                idCust: id_cust,
                idDeal: id_deal
            }
        }, function(err, sDeal){
            if( err ) return next(null, err);
            if( sDeal ) {
                SharedDeal.destroyAll({
                    idDeal: id_deal,
                    idCust: id_cust
                }, function(err, dealData){
                    if( err ) return next(null ,err);
                    if( dealData ) {
                        SharedDeal.updateAll({ idDeal: id_deal }, { status: "INCOMPLETE" }, function(err, dealUpdate){
                            if( err ) return next(null, err);
                            if( dealUpdate ) {
                                DealGroup.findOne({
                                    where: {
                                        idDeal: id_deal
                                    }
                                }, function(err, group){
                                    if( err ) return next(null, err);
                                    if( group ) {
                                        data = {
                                            status: 0,
                                            currentNbCust: group.currentNbCust - 1
                                        };
                                        group.updateAttributes(data, function(err, groupUpdate){
                                            if( err ) return next(null, err);
                                            if( groupUpdate ) {
                                                DealGroup.findOne({
                                                    where: {
                                                        idDeal: id_deal
                                                    }
                                                }, function(err, group){
                                                    if( err ) return next(null, err);
                                                    if( group.currentNbCust == 0 ) {
                                                        DealGroup.destroyById(group.id, function(err, result){
                                                            if( err ) return next(null, err);
                                                            if( result ) {
                                                                dataReturn = { "status":200, "success":1, "message":"Leave deal Success", "data":group };
                                                                return next(null, dataReturn);
                                                            } else {
                                                                dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                                                                return next(null, dataReturn);
                                                            }
                                                        });
                                                    } else {
                                                        dataReturn = { "status":200, "success":1, "message":"Leave deal Success", "data":group };
                                                        return next(null, dataReturn);
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                                        return next(null, dataReturn);
                                    }
                                });
                            } else {
                                dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                                return next(null, dataReturn);
                            }
                        });
                    } else {
                        dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                        return next(null, dataReturn);
                    }
                });
            } else {
                dataReturn = { "status":404, "success":0, "message":"You have leaved this deal or deal not exist" };
                return next(null, dataReturn);
            }
        });
    };

    //Deal conclude
    SharedDeal.remoteMethod('dealConclude', {
        description: 'Deal Conclude',
        accepts: [
            { arg: 'id_cust', type: 'string', required: true },
            { arg: 'id_deal', type: 'string', required: true }
        ],
        returns: {
            arg: 'data', type: 'object'
        },
        http: { status: 200 },
        http: { verb: 'post', errorStatus: 400 }
    });
    SharedDeal.dealConclude = function(id_cust, id_deal, next){
        var dataReturn = {};
        var DealGroup = app.models.DealGroup;
        //check that deal has exist yet
        SharedDeal.findOne({
            where: {
                idDeal: id_deal,
                idCust: id_cust,
                status: "COMPLETE",
                hasConcluded: 0
            },
            include: {
                relation: 'deal'
            }
        }, function(err, sDeal){
            if( err ) return next(null, err);
            if( sDeal ) {
                sDeal.updateAttribute('hasConcluded', 1, function(err, sDealUpdate){
                    if( err ) return next(null, err);
                    if( sDealUpdate ) {
                        //check that deal has all conclude
                        SharedDeal.find({
                            where: {
                                idDeal: id_deal,
                                status: "COMPLETE",
                                hasConcluded: 1
                            },
                            include: {
                                relation: 'users'
                            }
                        }, function(err, sDealData){
                            var sDealDecoded = sDeal.toJSON();
                            if( err ) return next(null, err);
                            if( sDealData.length == sDealDecoded.deal.nbRequiredCust ) {
                                DealGroup.findOne({
                                    where: {
                                        idDeal: id_deal
                                    }
                                }, function(err, group){
                                    if( err ) return next(null, err);
                                    if( group ) {
                                        group.updateAttribute('concluded', 1, function(err, groupUpdated){
                                            if( err ) return next(null, err);
                                            if( groupUpdated ){
                                                var i = 0;
                                                var message = {
                                                    heading: configEmail.phase_config.head,
                                                    text: configEmail.phase_config.in_progress.message
                                                };
                                                var renderer = loopback.template(path.resolve(__dirname, '../../server/views/notify_new_phase_email.ejs'));
                                                var html_body = renderer(message);
                                                sDealData.forEach(function(list, index){
                                                    i++;
                                                    var u = list.toJSON();
                                                    SharedDeal.app.models.Email.send({
                                                        to: u.users.email,
                                                        from: configEmail.phase_config.send_from,
                                                        subject: configEmail.phase_config.noreply,
                                                        html: html_body
                                                    });
                                                    if( sDealData.length == i ) {
                                                        dataReturn = { "status":200, "success":1, "message":"Deal Conlude Successful", "data":sDealUpdate };
                                                        return next(null, dataReturn);
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        dataReturn = { "status":404, "success":0, "message":"Group deal not found" };
                                        return next(null, dataReturn);
                                    }
                                });
                            } else {
                                dataReturn = { "status":200, "success":1, "message":"Deal Conclude Successful", "data": sDealUpdate };
                                return next(null, dataReturn);
                            }
                        });
                    } else {
                        dataReturn = {};
                        return next(null, dataReturn);
                    }
                });
            } else {
                dataReturn = { "status":404, "success":0, "message":"You have concluded this deal Or Deal not found" };
                return next(null, dataReturn);
            }
        });
    };

    //Review Deal
    SharedDeal.remoteMethod('reviewDeal', {
        description: 'Review Deal',
        accepts: [
            { arg: 'id_cust', type: 'string', required: true },
            { arg: 'id_deal', type: 'string', required: true },
            { arg: 'id_partner', type: 'string', required: true },
            { arg: 'rating', type: 'number', required: true },
            { arg: 'id_s_deal', type: 'string', required: true },
            { arg: 'comment', type: 'string', required: true }
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { status: 200 },
        http: { verb: 'post', errorStatus: 400 }
    });
    SharedDeal.reviewDeal = function(id_cust, id_deal, id_partner, rating, id_s_deal, comment, next){
        var userComment = app.models.UsersComments;
        var Deal = app.models.Deal;
        var DealGroup = app.models.DealGroup;
        //var uCommentDs = app.dataSources.mongodb_dev.connector;
        var dataReturn = {};
        if( id_cust === id_partner ) {
            dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
            return next(null, dataReturn);
        } else {
            var data = {
                idCust: id_cust,
                idDeal: id_deal,
                idOwner: id_partner,
                mark: rating,
                idSDeal: id_s_deal,
                comments: comment
            };
            userComment.create(data, function(err, uComment){
                if( err ) console.log(err);
                if( uComment ) {
                    userComment.find({
                        where: {
                            idOwner: id_partner,
                            idDeal: id_deal
                        }
                    }, function(err, comments){
                        if( err ) return next(null, err);
                        if( comments && comments.length > 0 ) {
                            userComment.find({ where: { idOwner: uComment.idOwner } }, function(err, userCommentData){
                                if( err ) console.log(err);
                                if( userCommentData ) {
                                    var j = 0;
                                    var totalMark = 0;
                                    var userModel = app.models.Users;
                                    userCommentData.forEach( function(data, index){
                                        totalMark += data.mark;
                                        j++;
                                        if( userCommentData.length == j ) {
                                            var userPoint = ( totalMark / comments.length );
                                            userModel.findOne({ where: { id: uComment.idOwner } }, function(err, user){
                                                if( err ) return next(null, err);
                                                if( user ){
                                                    user.updateAttribute('mark', userPoint, function(err, result){
                                                        if( err ) return next(null, err);
                                                        if( result ) {
                                                            SharedDeal.findOne({
                                                                where: {
                                                                    idDeal: id_deal,
                                                                    idCust: id_cust,
                                                                    status: "COMPLETE",
                                                                    hasReviewed: 0
                                                                },
                                                                include: {
                                                                    relation: 'deal',
                                                                    scope: {
                                                                        fields: ['idDeal', 'nbRequiredCust']
                                                                    }
                                                                }
                                                            }, function(err, sDeal){
                                                                if( err ) return next(null, err);
                                                                if( sDeal ) {
                                                                    var sDealDecoded = sDeal.toJSON();
                                                                    userComment.find({
                                                                        where: {
                                                                            idCust: id_cust,
                                                                            idDeal: id_deal
                                                                        }
                                                                    }, function(err, uCommentResult){
                                                                        if( err ) return next(null, err);
                                                                        if( uCommentResult.length == (sDealDecoded.deal.nbRequiredCust - 1) ) {
                                                                            sDeal.updateAttribute('hasReviewed', 1 , function(err, result){
                                                                                if( err ) return next(null, err);
                                                                                if( result ) {
                                                                                    //check that deal has all reviewed
                                                                                    SharedDeal.find({
                                                                                        where: {
                                                                                            idDeal: id_deal,
                                                                                            status: "COMPLETE",
                                                                                            hasReviewed: 1
                                                                                        },
                                                                                        include: {
                                                                                            relation: 'users',
                                                                                            scope: {
                                                                                                fields: ['email']
                                                                                            }
                                                                                        }
                                                                                    }, function(err, sDealData){
                                                                                        if( err ) return next(null, err);
                                                                                        if( sDealData && (sDealData.length == sDealDecoded.deal.nbRequiredCust) ) {
                                                                                            //gather all participant email and send notify
                                                                                            DealGroup.findOne({ where: { idDeal: id_deal } }, function(err, group){
                                                                                                if( err ) return next(null, err);
                                                                                                if( group ) {
                                                                                                    group.updateAttribute('reviewed', 1, function(err, groupUpdate){
                                                                                                        if( err ) return next(null, err)
                                                                                                        var i = 0;
                                                                                                        var message = {
                                                                                                            heading: configEmail.phase_config.head,
                                                                                                            text: configEmail.phase_config.ended.message
                                                                                                        };
                                                                                                        var renderer = loopback.template(path.resolve(__dirname, '../../server/views/notify_new_phase_email.ejs'));
                                                                                                        var html_body = renderer(message);
                                                                                                        sDealData.forEach(function(list, index){
                                                                                                            i++;
                                                                                                            var u = list.toJSON();
                                                                                                            SharedDeal.app.models.Email.send({
                                                                                                                to: u.users.email,
                                                                                                                from: configEmail.phase_config.send_from,
                                                                                                                subject: configEmail.phase_config.noreply,
                                                                                                                html: html_body
                                                                                                            });
                                                                                                            if( sDealData.length == i ) {
                                                                                                                dataReturn = { "status":200, "success":1, "message":"Review Success", "data": uComment };
                                                                                                                return next(null, dataReturn);
                                                                                                            }
                                                                                                        });
                                                                                                    });
                                                                                                } else {
                                                                                                    dataReturn = { "status":404, "success":1, "message":"Group deal not found" };
                                                                                                    return next(null, dataReturn);
                                                                                                }
                                                                                            });
                                                                                        } else {
                                                                                            dataReturn = { "status":200, "success":1, "message":"Review Success", "data": uComment };
                                                                                            return next(null, dataReturn);
                                                                                        }
                                                                                    });
                                                                                } else {
                                                                                    dataReturn = { "status":404, "success":0, "message":"User has reviewed" };
                                                                                    return next(null, dataReturn);
                                                                                }
                                                                            });
                                                                        } else {
                                                                            dataReturn = { "status":200, "success":1, "message":"Review Success", "data": uComment};
                                                                            return next(null, dataReturn);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        } else {
                                                            dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                                                            return next(null, dataReturn);
                                                        }
                                                    });
                                                } else {
                                                    dataReturn = { "status":404, "success":0, "message":"User not found" };
                                                    return next(null, dataReturn);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                            /*SharedDeal.getDataSource().connector.connect(function(err, db){
                                var collection = db.collection('UsersComments');
                                var idOwner = SharedDeal.getDataSource().ObjectID(id_partner);
                                collection.aggregate([
                                { $match: { idOwner: idOwner } },
                                { $group: {
                                        _id: idOwner,
                                        total: { $sum: "$mark" }
                                    }}
                                ], function(err, data) {
                                    if( err ) console.log(err);
                                    if( data ) {
                                        var userPoint = ( data[0].total / comments.length );
                                        var userModel = app.models.Users;
                                        userModel.findOne({
                                            where: { id: id_partner } }, function(err, user){
                                            if( err ) return next(null, err);
                                            if( user ) {
                                                user.updateAttribute('mark', userPoint, function(err, result){
                                                    if( err ) return next(null, err);
                                                    if( result ) {
                                                        SharedDeal.findOne({
                                                            where: {
                                                                idDeal: id_deal,
                                                                idCust: id_cust,
                                                                status: "COMPLETE",
                                                                hasReviewed: 0
                                                            },
                                                            include: {
                                                                relation: 'deal',
                                                                scope: {
                                                                    fields: ['idDeal', 'nbRequiredCust']
                                                                }
                                                            }
                                                        }, function(err, sDeal){
                                                            if( err ) return next(null, err);
                                                            if( sDeal ) {
                                                                //update shared deal reviewed
                                                                //check that user has given review all participants
                                                                var sDealDecoded = sDeal.toJSON();
                                                                userComment.find({
                                                                    where: {
                                                                        idCust: id_cust,
                                                                        idDeal: id_deal
                                                                    }
                                                                }, function(err, uCommentResult){
                                                                    if( err ) return next(null, err);
                                                                    if( uCommentResult.length == (sDealDecoded.deal.nbRequiredCust - 1) ) {
                                                                        sDeal.updateAttribute('hasReviewed', 1 , function(err, result){
                                                                            if( err ) return next(null, err);
                                                                            if( result ) {
                                                                                //check that deal has all reviewed
                                                                                SharedDeal.find({
                                                                                    where: {
                                                                                        idDeal: id_deal,
                                                                                        status: "COMPLETE",
                                                                                        hasReviewed: 1
                                                                                    },
                                                                                    include: {
                                                                                        relation: 'users',
                                                                                        scope: {
                                                                                            fields: ['email']
                                                                                        }
                                                                                    }
                                                                                }, function(err, sDealData){
                                                                                    if( err ) return next(null, err);
                                                                                    if( sDealData && (sDealData.length == sDealDecoded.deal.nbRequiredCust) ) {
                                                                                        //gather all participant email and send notify
                                                                                        DealGroup.findOne({ where: { idDeal: id_deal } }, function(err, group){
                                                                                            if( err ) return next(null, err);
                                                                                            if( group ) {
                                                                                                group.updateAttribute('reviewed', 1, function(err, groupUpdate){
                                                                                                    if( err ) return next(null, err)
                                                                                                    var i = 0;
                                                                                                    var message = {
                                                                                                        heading: configEmail.phase_config.head,
                                                                                                        text: configEmail.phase_config.ended.message
                                                                                                    };
                                                                                                    var renderer = loopback.template(path.resolve(__dirname, '../../server/views/notify_new_phase_email.ejs'));
                                                                                                    var html_body = renderer(message);
                                                                                                    sDealData.forEach(function(list, index){
                                                                                                        i++;
                                                                                                        var u = list.toJSON();
                                                                                                        SharedDeal.app.models.Email.send({
                                                                                                            to: u.users.email,
                                                                                                            from: configEmail.phase_config.send_from,
                                                                                                            subject: configEmail.phase_config.noreply,
                                                                                                            html: html_body
                                                                                                        });
                                                                                                        if( sDealData.length == i ) {
                                                                                                            dataReturn = { "status":200, "success":1, "message":"Review Success", "data": uComment };
                                                                                                            return next(null, dataReturn);
                                                                                                        }
                                                                                                    });
                                                                                                });
                                                                                            } else {
                                                                                                dataReturn = { "status":404, "success":1, "message":"Group deal not found" };
                                                                                                return next(null, dataReturn);
                                                                                            }
                                                                                        });

                                                                                    } else {
                                                                                        dataReturn = { "status":200, "success":1, "message":"Review Success", "data": uComment };
                                                                                        return next(null, dataReturn);
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                dataReturn = { "status":404, "success":0, "message":"User has reviewed" };
                                                                                return next(null, dataReturn);
                                                                            }
                                                                        });
                                                                    } else {
                                                                        dataReturn = { "status":200, "success":1, "message":"Review Success", "data": uComment};
                                                                        return next(null, dataReturn);
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                                                        return next(null, dataReturn);
                                                    }
                                                });
                                            } else {
                                                dataReturn = { "status":404, "success":0, "message":"User not found" };
                                                return next(null, dataReturn);
                                            }
                                        });
                                    }
                                });
                            });*/
                            /*var sDealDs = SharedDeal.dataSource;
                            sDealDs.connector.execute(query, function(err, result){
                                if( err ) return next(null, err);
                                if( result ) {
                                    var userPoint = ( result[0].totalMark / comments.length );
                                    var userModel = app.models.Users;
                                    userModel.findOne({
                                        where: {
                                            idCust: uComment.idOwner
                                        }
                                    }, function(err, user){
                                        if( err ) return next(null, err);
                                        if( user ) {
                                            user.updateAttribute('mark', userPoint, function(err, result){
                                                if( err ) return next(null, err);
                                                if( result ) {
                                                    SharedDeal.findOne({
                                                        where: {
                                                            idDeal: id_deal,
                                                            idCust: id_cust,
                                                            status: "COMPLETE",
                                                            hasReviewed: 0
                                                        },
                                                        include: {
                                                            relation: 'deal',
                                                            scope: {
                                                                fields: ['idDeal', 'nbRequiredCust']
                                                            }
                                                        }
                                                    }, function(err, sDeal){
                                                        if( err ) return next(null, err);
                                                        if( sDeal ) {
                                                            //update shared deal reviewed
                                                            //check that user has given review all participants
                                                            var sDealDecoded = sDeal.toJSON();
                                                            userComment.find({
                                                                where: {
                                                                    idCust: id_cust,
                                                                    idDeal: id_deal
                                                                }
                                                            }, function(err, uCommentResult){
                                                                if( err ) return next(null, err);
                                                                if( uCommentResult.length == (sDealDecoded.deal.nbRequiredCust - 1) ) {
                                                                    sDeal.updateAttribute('hasReviewed', 1 , function(err, result){
                                                                        if( err ) return next(null, err);
                                                                        if( result ) {
                                                                            //check that deal has all reviewed
                                                                            SharedDeal.find({
                                                                                where: {
                                                                                    idDeal: id_deal,
                                                                                    status: "COMPLETE",
                                                                                    hasReviewed: 1
                                                                                },
                                                                                include: {
                                                                                    relation: 'users',
                                                                                    scope: {
                                                                                        fields: ['email']
                                                                                    }
                                                                                }
                                                                            }, function(err, sDealData){
                                                                                if( err ) return next(null, err);
                                                                                if( sDealData && (sDealData.length == sDealDecoded.deal.nbRequiredCust) ) {
                                                                                    //gather all participant email and send notify
                                                                                    DealGroup.findOne({ where: { idDeal: id_deal } }, function(err, group){
                                                                                        if( err ) return next(null, err);
                                                                                        if( group ) {
                                                                                            group.updateAttribute('reviewed', 1, function(err, groupUpdate){
                                                                                                if( err ) return next(null, err)
                                                                                                var i = 0;
                                                                                                var message = {
                                                                                                    heading: configEmail.phase_config.head,
                                                                                                    text: configEmail.phase_config.ended.message
                                                                                                };
                                                                                                var renderer = loopback.template(path.resolve(__dirname, '../../server/views/notify_new_phase_email.ejs'));
                                                                                                var html_body = renderer(message);
                                                                                                sDealData.forEach(function(list, index){
                                                                                                    i++;
                                                                                                    var u = list.toJSON();
                                                                                                    SharedDeal.app.models.Email.send({
                                                                                                        to: u.users.email,
                                                                                                        from: configEmail.phase_config.send_from,
                                                                                                        subject: configEmail.phase_config.noreply,
                                                                                                        html: html_body
                                                                                                    });
                                                                                                    if( sDealData.length == i ) {
                                                                                                        dataReturn = { "status":200, "success":1, "message":"Review Success", "data": uComment };
                                                                                                        return next(null, dataReturn);
                                                                                                    }
                                                                                                });
                                                                                            });
                                                                                        } else {
                                                                                            dataReturn = { "status":404, "success":1, "message":"Group deal not found" };
                                                                                            return next(null, dataReturn);
                                                                                        }
                                                                                    });

                                                                                } else {
                                                                                    dataReturn = { "status":200, "success":1, "message":"Review Success", "data": uComment };
                                                                                    return next(null, dataReturn);
                                                                                }
                                                                            });
                                                                        } else {
                                                                            dataReturn = { "status":404, "success":0, "message":"User has reviewed" };
                                                                            return next(null, dataReturn);
                                                                        }
                                                                    });
                                                                } else {
                                                                    dataReturn = { "status":200, "success":1, "message":"Review Success", "data": uComment};
                                                                    return next(null, dataReturn);
                                                                }
                                                            });
                                                        }
                                                    });
                                                } else {
                                                    dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                                                    return next(null, dataReturn);
                                                }
                                            });
                                        } else {
                                            dataReturn = { "status":404, "success":0, "message":"User not found" };
                                            return next(null, dataReturn);
                                        }
                                    });
                                } else {
                                    dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                                    return next(null, dataReturn);
                                }
                            });*/
                        } else {
                            dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                            return next(null, dataReturn);
                        }
                    });
                } else {
                    dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                    return next(null, dataReturn);
                }
            });
        }
    };

    //Archived Deal
    SharedDeal.remoteMethod('archiveDeal', {
        description: 'Archive A Deal',
        accepts: [
            { arg: 'id_cust', type: 'string', required: true },
            { arg: 'id_deal', type: 'string', required: true }
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { verb: 'post', errorStatus: 400 }
    });
    SharedDeal.archiveDeal = function(id_cust, id_deal, next){
        var dataReturn = {};
        //check that Deal has archive before
        SharedDeal.findOne({
            where: {
                idCust: id_cust,
                idDeal: id_deal,
                archive: 0
            }
        }, function(err, sDeal){
            if( err ) return next(null, err);
            if( sDeal ) {
                sDeal.updateAttribute('archive', 1, function(err, dealData){
                    if( err ) return next(null, err);
                    if( dealData ) {
                        dataReturn = { "status":200, "success":1, "message":"Archive deal success", "data":dealData };
                        return next(null, dataReturn);
                    } else {
                        dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                        return next(null, dataReturn);
                    }
                });
            } else {
                dataReturn = { "status":404, "success":0, "message":"You have archived this deal before" };
                return next(null, dataReturn);
            }
        });
    };


};
