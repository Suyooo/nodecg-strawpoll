module.exports = function(nodecg) {
    var express = require('express'),
        app = express(),
        request = require('request');
    
    app.get('/strawpoll/:id', function(req, res) {
		url = 'http://strawpoll.me/api/v2/polls/'+req.params.id;

		request(url, function(error, response, out){
			if(!error){
				res.writeHead(200, {
					'Content-Type': 'text/plain',
					'Expires': new Date().toUTCString()
				});
				res.end(out);
			}
		})
    });

    nodecg.mount(app);
};