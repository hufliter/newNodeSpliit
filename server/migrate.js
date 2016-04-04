/**
 * loopback: create build-in models tables
 *
 * put migrate.js file in server folder
 * run `node migrate.js`
 * @type {[type]}
 */
/*var app = require('./server');
var dataSource = app.dataSources.spliit_dev;

dataSource.automigrate('User', function(err) {

    if (!err) {
        console.log('User table created');
    } else {
        console.log('-- User table not created');
    }

    dataSource.automigrate('AccessToken', function(err) {

        if (!err) {
            console.log('AccessToken table created');
        } else {
            console.log('-- AccessToken table not created');
        }

        dataSource.automigrate('ACL', function(err) {

            if (!err) {
                console.log('ACL table created');
            } else {
                console.log('-- ACL table not created');
            }

            dataSource.automigrate('RoleMapping', function(err) {

                if (!err) {
                    console.log('RoleMapping table created');
                } else {
                    console.log('-- RoleMapping table not created');
                }

                dataSource.automigrate('Role', function(err) {
                    if (!err) {
                        console.log('Role table created');
                    } else {
                        console.log('-- Role table not created');
                    }

                    dataSource.disconnect(); // close connection

                });

            });

        });

    });

});*/