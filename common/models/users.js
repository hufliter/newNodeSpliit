var config = require('../../server/config.json');
var configEmail = require('../../server/config_email.json');
var ds = require('../../server/datasources');
var path = require('path');
var app = require('../../server/server');
var loopback = require('loopback');
var async = require('async');
var helper = require('../../server/helper');
var fs = require('fs');
var Role = loopback.Role;
var RoleMapping = loopback.RoleMapping;
var accessToken = loopback.AccessToken;

module.exports = function(Users) {
	var user = app.models.User;
	Users.afterRemote('create', function(ctx, user, next) {
        var message = {
            heading: 'Welcome to Spliit',
            text: 'Now you can login spliit system'
        };
        var renderer = loopback.template(path.resolve(__dirname, '../../server/views/verify.ejs'));
        var html_body = renderer(message);
        Users.app.models.Email.send({
            to: user.email,
            from: configEmail.phase_config.noreply,
            subject: 'Welcome Spliiter!',
            html: html_body,
        });
        Users.findOne({
            where: {
                email: user.email
            }
        }, function(err, uData){
            if( err ) console.log(err);
            if( uData ) {
                uData.updateAttribute('emailVerified', 1, function(err, result){
                    if( err ) console.log(err);
                });
            }
        });
        next();
	});

	Users.observe('after save', function(ctx, next){
		if( ctx.instance ) {
			if( ctx.isNewInstance !== undefined && ctx.instance.facebookId === undefined ) {
                Role.findOne({ where: { name: ctx.instance.type } }, function(err, role){
                    if( err ) {
                        return next(err);
                    } 
                    if (role) {
                        RoleMapping.create({
                            principalType: "USER",
                            principalId: ctx.instance.id,
                            roleId: role.id
                        }, function(err, roleMapping){
                            if( err ) {
                                return next(err);
                            } 
                            if( roleMapping ) {
                                var pathDir = 'uploads/user/';
                                var imagePath = ctx.instance.avatar;
                                var fileName = helper.getFileName(imagePath);
                                fs.rename('uploads/tmp/'+ fileName, pathDir+'/'+ fileName, function(err, result){
                                    if( err ) {
                                        return next();
                                    } else {
                                        var newPath = 'containers/user/download/'+ fileName;
                                        Users.findOne({
                                            where: {
                                                id: ctx.instance.id
                                            }
                                        }, function(err, uData){
                                            if( err ) return next(null, err);
                                            if( uData ) {
                                                uData.updateAttribute('avatar', newPath, function(err, uDataUpdate){
                                                    if( err ) {
                                                        return next(null, err);
                                                    }
                                                    if( uDataUpdate ) {
                                                        console.log(uDataUpdate);
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
            } else {
                Role.findOne({ where: { name: ctx.instance.type } }, function(err, role){
                    if( err ) return next(err);
                    if( role ) {
                        RoleMapping.create({
                            principalType: "USER",
                            principalId: ctx.instance.id,
                            roleId: role.id
                        }, function(err, roleMapping){
                            if( err ) return next(err);
                            if( roleMapping ) {
                                return next();
                            }
                        });
                    }
                });
            }
		}
	});

	Users.on('resetPasswordRequest', function(info, next){
        if( info ) {
            console.log(config.HOME_URL);
            var url = config.HOME_URL + '/resetPassword/' + info.accessToken.id;
            var message = {
                heading: configEmail.reset_password_email.head,
                url: url
            };
            var renderer = loopback.template(path.resolve(__dirname, '../../server/views/email_reset_password.ejs'));
            var html_body = renderer(message);
            Users.app.models.Email.send({
                to: info.email,
                from: configEmail.phase_config.noreply,
                subject: 'Password reset',
                html: html_body
            }, function(err){
                if( err ) console.log('> error sending password reset email');
                console.log('> sending password reset email to:', info.email);
            });
        } else {
            return next(null);
        }
	});

    //fbAuthenicate
    Users.remoteMethod('fbAuthenticate', {
        description: 'Facebook Authentication',
        accepts: [
            { arg: 'email', type: 'string', required: true },
            { arg: 'facebookId', type: 'string', required: true},
            { arg: 'first_name', type: 'string' },
            { arg: 'last_name', type: 'string' },
            { arg: 'gender', type: 'string' },
            { arg: 'country', type: 'string' },
        ],
        returns: {
            arg: 'data', type: 'object'
        },
        http: { status: 200 },
        http: { verb: 'post', errorStatus: 400 }
    });
    Users.fbAuthenticate = function(email, facebookId, first_name, last_name, gender, country, next) {
        var dataReturn = {};
        var accessToken = app.models.AccessToken;
        if( email || email != undefined ) {
            if( facebookId || facebookId != undefined ) {
                Users.findOne({
                    where: {
                        email: email,
                        facebookId: facebookId
                    },
                    fields: ['id', 'firstName', 'lastName', 'email','mobilePhone', 'birthdate', 'gender', 'mark','country','avatar', 'facebookId']
                }, function(err, uData){
                    if( err ) return next(err);
                    if( uData ) {
                        var authStr = uData.facebookId + config.hashSalt;
                        var data = {
                            email: uData.email,
                            password: authStr
                        };
                        Users.login(data, function(err, resultData){
                            if( err ) return next(null, err);
                            if( resultData ) {
                                uData.accessToken = resultData.id;
                                dataReturn = { "status":200, "success":1, "message": "User Login Successful", "user": uData };
                                return next(null, dataReturn);
                            } else {
                                dataReturn = { "success":0, "message":"Oops! Something went wrong" };
                                return next(null, dataReturn);
                            }
                        });
                    } else {
                        var fbPictureGraph = 'https://graph.facebook.com/' + facebookId +'/picture?type='+ config.imageType;
                        var avatar = fbPictureGraph;
                        var authStr = facebookId + config.hashSalt;
                        var newUser = {
                            firstName: first_name,
                            lastName: last_name,
                            facebookId: facebookId,
                            gender: gender,
                            country: country,
                            avatar: avatar,
                            email: email,
                            password: authStr,
                            emailVerified: 1,
                            mark: 0,
                            mobilePhone: '',
                            created: new Date(),
                            lastUpdated: new Date()
                        };
                        Users.create(newUser, function(err, user){
                            if( err ) return next(null, err);
                            if( user) {
                                var credentials = {
                                    email: email,
                                    password: authStr
                                };
                                Users.login(credentials, function(err, data){
                                    if( err ) return next(null, err);
                                    if( data ) {
                                        accessToken.findOne({
                                            where :{
                                                id: data.id
                                            }
                                        }, function(err, data){
                                            if( err ) return next(null, err);
                                            if( data ) {
                                                Users.findOne({
                                                    where: {
                                                        _id: data.userId
                                                    },
                                                    fields: ['id', 'firstName', 'facebookId' ,'lastName', 'email','mobilePhone', 'birthdate', 'gender', 'mark','country','avatar', 'is_admin']
                                                }, function(err, userData){
                                                    if( err ) return next(null, err);
                                                    if( userData ) {
                                                        userData.accessToken = data.id;
                                                        if (!userData.is_admin) 
                                                            userData.is_admin = 0;
                                                        dataReturn = { "status":200, "success":1, "message":"Login Success", "user":userData };
                                                        return next(null, dataReturn);
                                                    } else {
                                                        dataReturn = { "status":404, "success":0, "message":"User Not Found", "data":null };
                                                        return next(null, dataReturn);
                                                    }
                                                });
                                            } else {
                                                dataReturn = { "status":404, "success":0, "message":"User Not Found", "data":null };
                                                return next(null, dataReturn);
                                            }
                                        });
                                    }
                                });
                            } else {
                                dataReturn = { "success":0, "message":"Oops! Something went wrong" };
                                return next(null, dataReturn);
                            }
                        });
                    }
                });
            } else {
                dataReturn = { "success": 0, "message": "Facebook Id is missing" };
                return next(null, dataReturn);
            }
        } else {
            dataReturn = { "success": 0, "message": "Email value is missing" };
            return next(null, dataReturn);
        }
    };
    //end fbAuthenticate

    //User requestPasswordReset
    Users.remoteMethod('requestPasswordReset', {
        description: 'Request Password Reset',
        accepts: [
            { arg: 'email', type: 'string', required: true }
        ],
        returns: {
            arg: 'data', type: 'object'
        },
        http: { verb: 'post' , errorStatus: 400 }
    });

    Users.requestPasswordReset = function(email, next){
        var dataReturn = {};
        //get extended function from User model
        Users.findOne({
            where: {
                email: email
            }
        }, function(err, user){
            if( err ) return next(null, err);
            if( user ) {
                if( user.facebookId ) {
                    dataReturn = { "status":404, "success":0, "message":"Can not reset this user" };
                    return next(null, dataReturn);
                } else {
                    Users.resetPassword({
                        email: user.email
                    }, function( err ){
                        if( err ) return next(null, err);
                        dataReturn = { "status":200, "success":1, "message":"Request reset password has send, please check your email" };
                        return next(null, dataReturn);
                    });
                }
            } else {
                dataReturn = { "status":404, "success":0, "message": "Email Not Found" };
                return next(null, dataReturn);
            }
        });
    };
    //End requestPasswordReset

    // confirmResetPassword 
    Users.remoteMethod('confirmResetPassword', {
        description: 'Get Reset Password',
        accepts: [
            { arg: 'access_token', type: 'string', required: true }
        ],
        returns: {
            arg: 'data', type: 'object'
        },
        http: { status: 200 },
        http: { verb: 'get', errorStatus: 400 }
    });
    Users.confirmResetPassword = function(access_token, next){
        var accessToken = app.models.AccessToken;
        var dataReturn = {};
        accessToken.findOne({
            where: {
                id: access_token
            }
        }, function(err, token){
            if( err ) return next(null,err);
            if( token ) {
                Users.findOne({
                    where: {
                        id: token.userId
                    },
                    fields: [ 'id', 'email' ]
                }, function(err, userData){
                    if( err ) return next(null, err);
                    if( userData ) {
                        dataReturn = { "status":200, "success":1, "message":"Valid Reset Password Token", "data": userData };
                        return next(null, dataReturn);
                    } else {
                        dataReturn = { "status":404, "success":0, "message":"User not found" };
                        return next(null, dataReturn);
                    }
                });
            } else {
                dataReturn = { "status":404, "success":0, "message":"Invalid Token" };
                return next(null, dataReturn);
            }
        });
    };
    // End confirmResetPassword

    //User reset password
    Users.remoteMethod('rePassword',{
        description: 'Reset Password',
        accepts: [
            { arg: 'accessToken', type: 'string', required: true },
            { arg: 'password', type: 'string', required: true }
        ],
        returns: {
            arg: 'data', type: 'object'
        },
        http: { status: 200 },
        http: { verb: 'post', errorStatus: 400 }
    });

    Users.rePassword = function(accessToken, password, next){
        var dataReturn = {};
        var AccessTokenModel = app.models.AccessToken;
        if( accessToken || accessToken != undefined) {
            AccessTokenModel.findById( accessToken , function(err, uData) {
                if( err ) return next(null, err);
                if( uData ) {
                    Users.findById(uData.userId, function(err, user){
                        if( err ) return next(null, err);
                        if( user ) {
                            user.updateAttribute('password', password, function(err, data){
                                if( err ) return next(null, err);
                                if( data ) {
                                    AccessTokenModel.destroyById(uData.id, function(err, data){
                                        if( err ) return next(null, err);
                                        dataReturn = { "status":200, "success":1 , "message":"Change Password Successful" };
                                        return next(null, dataReturn);
                                    });
                                } else {
                                    dataReturn = { "status":400, "success":0 , "message":"Oops Something went wrong" };
                                    return dataReturn;
                                }
                            });
                        } else {
                            dataReturn = { "status":404, "success":0 , "message":" User Not Found" };
                            return next(null, dataReturn);
                        }
                    });
                } else {
                    dataReturn = { "status":404, "success":0 , "message":"Can not found user match this token" };
                    return next(null, dataReturn);
                }
            });
        } else {
            dataReturn = { "status":404, "success":0, "message":"Token is missing or invalid" };
            return next(null, dataReturn);
        }
        
    };
    //End User reset password

    Users.remoteMethod('upload', {
        description: 'Upload file',
        accepts: [
            { arg: 'ctx', type: 'object', http: { source: 'context' } },
            { arg: 'options', type: 'string', http: { source: 'query' } }
        ],
        returns: {
            arg: 'fileObject', type: 'object', root: true
        },
        http: { verb: 'post' }
    });
    //give an access token to get image
    Users.upload = function(ctx, options, next){
        var container = app.models.container;
        var dataReturn = {};
        container.getContainer(options, function(err, result){
            if( err ) return next(null, err);
            if( result && result != undefined ) {
                var optObj = { container : result.name };
                container.upload(ctx.req, ctx.result, optObj, function(err, fileObj){
                    if( err ) return next(null, err);
                    if( fileObj ) {
                        var image = fileObj.files.fileUpload[0];
                        var file = {
                            url: config.URL_SITE + '/api/containers/' + result.name + '/download/' + image.name,
                            path: 'containers/' + result.name + '/download/' + image.name
                        }
                        dataReturn = { "status": 200, "success":1, "message":"Upload success", "data":file };
                        return next(null, dataReturn);
                    } else {
                        dataReturn = { "status":404, "success":0 ,"message":"Oops! Something went wrong" };
                        return next(null, dataReturn);
                    }
                });
            } else {
                dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                return next(null, dataReturn);
            }
        });
    };

    Users.remoteMethod('contact', {
        description: 'Contact',
        accepts: [
            { arg: 'email', type: 'string', required: true },
            { arg: 'name', type: 'string', required: true },
            { arg: 'message', type: 'string', required: true }
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { verb: 'post' }
    });
    Users.contact = function(email, name, message, next){
        var dataReturn = {};
        var message = {
            heading: configEmail.contact_mail_config.head,
            text: message
        };
        var renderer = loopback.template(path.resolve(__dirname, '../../server/views/contact_mail.ejs'));
        var html_body = renderer(message);
        Users.app.models.Email.send({
            to: configEmail.contact_mail_config.toAdmin,
            from: email,
            subject: 'New Message From '+ name,
            html: html_body
        }, function(err, success){
            if( err ) return next(null, err);
            if( success ) {
                dataReturn = { "status":200, "success":1, "message":"Send Contact Success" };
                return next(null, dataReturn);
            } else {
                dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                return next(null, dataReturn);
            }
        });
    };

    Users.remoteMethod('myDeals', {
        description: 'Get My Deals List',
        accepts: [
            { arg: 'ctx', type: 'string', http: { source: 'context' } }
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { verb: 'get' }
    });
    Users.myDeals = function(ctx, next){
        var sharedDeal = app.models.SharedDeal;
        var dealGroup = app.models.DealGroup;
        var dataReturn = {};
        var sDealDs = sharedDeal.dataSource;
        var ctx = loopback.getCurrentContext();
        var userModel = app.models.Users;

        var currentUser = ctx && ctx.get('accessToken');

        if( currentUser && currentUser != undefined ) {
            var userId = currentUser.userId;
            //still fixing
            //TP
            //var query = "SELECT * from shared_deal LEFT JOIN deal as d ON d.id_deal = shared_deal.id_deal WHERE shared_deal.id_cust='" +userId+"' AND d.active = 1";
            sharedDeal.find({
                where: {
                    idCust: userId
                },
                include: {
                    relation: 'deal',
                    where: {
                        active: 1
                    }
                }
            }, function(err, sDealData){
                if( err ) {
                    dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                    return next(null, dataReturn);
                }
                if( sDealData.length > 0 ) {
                    var i = 0;

                    sDealData.forEach(function(sDeal, index){
                        sharedDeal.find({
                            where: {
                                idDeal: sDeal.idDeal,
                                idCust: { neq: sDeal.idCust }
                            },
                            include:  {
                                relation: 'users',
                                scope: {
                                    fields: ['avatar', 'mark', 'firstName', 'lastName', 'mobilePhone', 'facebookId']
                                }
                            }
                            
                        }, function(err, partner){
                            if( err ) console.log(err);
                            //Add partner to shared deal
                            if( partner && partner.length > 0 ) {
                                sDeal.partners = partner;
                                async.waterfall([
                                    async.apply(getPartnerComment, partner, userId)
                                ], function(err, result){
                                    if( err ) console.log(err);
                                    if( result ) {
                                        dealGroup.findOne({
                                            where: {
                                                idDeal: sDeal.idDeal
                                            }
                                        }, function(err, dealGroupData){
                                            if( err ) console.log(err);
                                            if( dealGroupData ) {
                                                sDeal.group_concluded = dealGroupData.concluded;
                                                sDeal.group_reviewed = dealGroupData.reviewed;
                                                sDeal.group_status = dealGroupData.status;
                                                sDeal.archived = sDeal.archive;
                                                i++;
                                                if( sDealData.length == i ) {
                                                    dataReturn = { "status": 200, "success":1, "message":"Get my deals list success", "data": sDealData };
                                                    return next(null, dataReturn);
                                                }
                                            } 
                                        });
                                    }
                                });
                            } else {
                                sDeal.partners = [];
                                dealGroup.findOne({
                                    where: {
                                        idDeal: sDeal.idDeal
                                    }
                                }, function(err, dealGroupData){
                                    if( err ) console.log(err);
                                    if( dealGroupData ) {
                                        sDeal.group_concluded = dealGroupData.concluded;
                                        sDeal.group_reviewed = dealGroupData.reviewed;
                                        sDeal.group_status = dealGroupData.status;
                                        sDeal.archived = sDeal.archive;
                                        i++;
                                        if( sDealData.length == i ) {
                                            dataReturn = { "status": 200, "success":1, "message":"Get my deals list success", "data": sDealData };
                                            return next(null, dataReturn);
                                        }
                                    } 
                                });
                            }
                        });
                    });
                } else {
                    dataReturn = { "status":404, "success":0, "message":"Deal not found", "data":null };
                    return next(null, dataReturn);
                }
            });
        } else {
            dataReturn = { "status":400, "success":0, "message":"You are not Authorize" };
            return next(null, dataReturn);
        }
    };

    //get User Comment
    function getPartnerComment(partner, userId, next){
        var i = 0;
        var userCommentModel = app.models.UsersComments;
        partner.forEach(function(partnerData, index){
            userCommentModel.find({
                where: {
                    idDeal: partnerData.idDeal,
                    idOwner: partnerData.idCust,
                    idCust: userId
                }
            }, function(err, commentData){
                i++;
                if( err ) console.log(err);
                if( commentData ) {
                    partnerData.comments = commentData;
                } else {
                    partnerData.comments = [];
                }

                if( partner.length == i ) {
                    next(null, userCommentModel);
                }
            });
        });
    };

    Users.remoteMethod('authenticate', {
        description: 'Login',
        accepts: [
            { arg: 'email', type: 'string', required: true },
            { arg: 'password', type: 'string', required: true }
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { verb: 'post' }
    });

    Users.authenticate = function(email, password, next){
        var dataReturn = {};
        var accessToken = app.models.AccessToken;
        var user = app.models.Users;
        var uData = {
            email: email,
            password: password
        };
        Users.login(uData, function(err, data){
            if( err ) {
                console.log(err);
                dataReturn = { "status":404, "success":0, "message":"Email Or Password is Invalid", "data":null };
                return next(null, dataReturn);
            } else {
                accessToken.findOne({
                    where :{
                        id: data.id
                    }
                }, function(err, data){
                    if( err ) return next(null, err);
                    if( data ) {
                        user.findOne({
                            where: {
                                _id: data.userId
                            },
                            fields: ['id', 'firstName', 'lastName', 'email','mobilePhone', 'birthdate', 'gender', 'mark','country','avatar', 'is_admin', 'facebookId']
                        }, function(err, userData){
                            if( err ) return next(null, err);
                            if( userData ) {
                                userData.accessToken = data.id;
                                if (!userData.is_admin) 
                                    userData.is_admin = 0;
                                dataReturn = { "status":200, "success":1, "message":"Login Success", "data":userData };
                                return next(null, dataReturn);
                            } else {
                                dataReturn = { "status":404, "success":0, "message":"User Not Found", "data":null };
                                return next(null, dataReturn);
                            }
                        });
                    } else {
                        dataReturn = { "status":404, "success":0, "message":"User Not Found", "data":null };
                        return next(null, dataReturn);
                    }
                });
            }
        });
    };

    Users.remoteMethod('signOut', {
        description: 'Logout',
        accepts: [
            { arg: 'access_token', type: 'string', required: true },
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { verb: 'post' }
    });
    Users.signOut = function(access_token, next){
        var dataReturn = {};
        var accessToken = app.models.AccessToken;
        accessToken.findOne({
            where: {
                id: access_token
            }
        }, function(err, data){
            if( err ) return next(null, err);
            if( data ) {
                Users.logout(data.id, function(err, data){
                    if( err ) return next(null, err);
                    if( data ) {
                        dataReturn = { "status":200, "success":1, "message":"Logout success" };
                        return next(null, dataReturn);
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
    };

    Users.remoteMethod('getProfile', {
        description: 'Get User Profile',
        accepts: [
            { arg: 'ctx', type: 'string', http: { source: 'context' } },
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { verb: 'get' }
    });
    Users.getProfile = function(ctx, next){
        var accessToken = app.models.AccessToken;
        var dataReturn = {};
        var ctx = loopback.getCurrentContext();
        var currentUser = ctx && ctx.get('accessToken');
        accessToken.findById(currentUser.id, function(err, token){
            if( err ) return next(null, err);
            if( token ) {
                Users.find({
                    where: {
                        id: token.userId
                    },
                    fields: ['id', 'email', 'firstName', 'lastName', 'mobilePhone', 'birthdate', 'gender', 'mark', 'country', 'avatar', 'facebookId']
                }, function(err, uData){
                    if( err ) return next(null, err);
                    if( uData ) {
                        dataReturn = { "status":200, "success":1, "message":"Get profile success", "data":uData };
                        return next(null, dataReturn);
                    } else {
                        dataReturn = { "status":404, "success":0, "message":"Profile Not found", "data":null };
                        return next(null, dataReturn);
                    }
                });
            } else {
                dataReturn = { "status":401, "success":0, "message":"Unauthorized" };
                return next(null, dataReturn);
            }
        });
    };

    Users.remoteMethod('updateProfile', {
        description: 'Update User Profile',
        accepts: [
            { arg: 'ctx', type: 'string', http: { source: 'context' } },
            { arg: 'formData', type: 'object', http: { source: 'body' } }
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { verb: 'post' }
    });
    Users.updateProfile = function(ctx, formData, next){
        var accessToken = app.models.AccessToken;
        var dataReturn = {};
        var ctx = loopback.getCurrentContext();
        var currentUser = ctx && ctx.get('accessToken');

        accessToken.findById(currentUser.id, function(err, token){
            if( err ) return next(null, err);
            if( token ) {
                Users.findOne({
                    where: {
                        id: token.userId
                    },
                    fields: ['id', 'email', 'firstName', 'lastName', 'mobilePhone', 'birthdate', 'gender', 'mark', 'country', 'avatar']
                }, function(err, uData){
                    if( err ) return next(null, err);
                    if( uData ) {
                        uData.updateAttributes(formData, function(err, result){
                            if( err ) return next(null, err);
                            if( result ) {
                                dataReturn = { "status":200, "success":1, "message":"Profile Update Successful", "data":result };
                                return next(null, dataReturn);
                            } else {
                                dataReturn = { "status":404, "success":0, "message":"Oops! Something went wrong" };
                                return next(null, dataReturn);
                            }
                        });
                    } else {
                        dataReturn = { "status":404, "success":0, "message":"Profile Not found", "data":null };
                        return next(null, dataReturn);
                    }
                });
            } else {
                dataReturn = { "status":401, "success":0, "message":"Unauthorized" };
                return next(null, dataReturn);
            }
        });
    };

    Users.remoteMethod('getReviews', {
        description: 'Get Reviews',
        accepts: [
            { arg: 'ctx', type: 'string', http: { source: 'context' } }
        ],
        returns: {
            arg: 'data', type: 'object', root: true
        },
        http: { verb: 'get' }
    });
    Users.getReviews = function(ctx, next){
        var ctx = loopback.getCurrentContext();
        var currentUser = ctx && ctx.get('accessToken');
        var dataReturn = {};
        var accessToken = app.models.AccessToken;
        var userComments = app.models.UsersComments;

        accessToken.findById(currentUser.id, function(err, token){
            if( err ) return next(null, err);
            if( token ) {
                userComments.find({
                    where: {
                        idOwner: token.userId
                    },
                    include: {
                        relation: 'users'
                    }
                }, function(err, uComments){
                    if( err ) return next(null, err);
                    if( uComments && uComments.length > 0 ) {
                        dataReturn = { "status": 200, "success":1, "message":"Get user comments success", "data":uComments };
                        return next(null, dataReturn);
                    } else {
                        dataReturn = { "status": 200, "success":0, "message":"User comments not found", "data": null };
                        return next(null, dataReturn);
                    }
                });
            } else {
                dataReturn = { "status":404, "success":0, "message":"Unauthorized" };
                return next(null, dataReturn);
            }
        });
    };
};
