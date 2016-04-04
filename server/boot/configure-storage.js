var crypto = require('crypto');
module.exports = function(app) {
    app.dataSources.myfileds.connector.getFilename = function(file, req, res) {
        var origFilename = file.name;
        // optimisticly get the extension
        var parts = origFilename.split('.'),
            extension = parts[parts.length-1];
        // Using a local timestamp + user id in the filename (you might want to change this)
        var hashString = crypto.randomBytes(12);
        var newFilename = (new Date()).getTime()+'_'+ hashString.toString('hex') +'.'+extension;
        return newFilename;
    };
}