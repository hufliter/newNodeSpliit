module.exports = function(server) {
	// Install a `/` route that returns server status
	var loopback = require('loopback');
	var router = server.loopback.Router();
	router.get('/', server.loopback.status());
	server.set('view engine', 'ejs');
	server.use(router);


	var CronJob = require('cron').CronJob;
	var helper = require('../helper');
	var dealModel = server.models.Deal;
	var job = new CronJob({
		cronTime: '*/30 * * * *',
		onTick: function() {
			/*
			 * This cron will run every 30 minute past every hour
			 * And call function to check the expiration deal
			 */
			dealModel.find({
				where: {
					active: 1,
					endDate: { lte: helper.getCurrentDateTime() },
					is_system: 1
				}
			}, function(err, dealData){
				if( err ) console.log(err);
				if( dealData ) {
					var i = 0;
					dealData.forEach(function(deal){
						deal.updateAttribute('active', 0, function(err, result){
							i++;
							if( err ) console.log(err);
							if( dealData.length == i ) {
								console.log('execute check deal cron success');
							}
						});
					});
				} else {
					console.log('oop! can not found deal');
				}
			});
		},
		start: false,
		timeZone: 'Europe/Paris'
	});
	job.start();
};
