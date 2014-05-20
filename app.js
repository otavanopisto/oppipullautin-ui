var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , path = require('path')
  , wkhtmltopdf = require('wkhtmltopdf')
  , elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

wkhtmltopdf.command = __dirname+"/wkhtmltox/bin/wkhtmltopdf";

server.listen(8080);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/gettags', function(req, res){
	
	client.search({
		  index: 'oppimateriaalit',
		  fields: 'tags',
		  q: '*:*'
		}, function (error, response) {
		var allTags = new Array();
		  var hits = response['hits']['hits'];
		  for(var i = 0; i < hits.length;i++){
			  var tags = hits[i].fields.tags;
			  for(var j = 0; j < tags.length; j++){
				  if(allTags.indexOf(tags[j]) == -1){
					  allTags.push(tags[j]);
				  }
			  }
		  }
		  res.send(allTags);
		});
});


app.get('/getcount/:tags', function(req, res){
	
	var tagstr = req.param('tags');
	client.count({
		 index: 'oppimateriaalit',
		 q: 'tags:'+tagstr
		}, function (error, response) {
			res.send(response);
		});
});

app.get('/getbook/:tags', function(req, res){
	
	var tagstr = req.param('tags');
	
	client.search({
		  index: 'oppimateriaalit',
		  q: 'tags:'+tagstr
		}, function (error, response) {
			var html = "";
			for(var i = 0; i < response['hits']['hits'].length;i++){
				html += response['hits']['hits'][i]['_source']['content'];
			}
		  wkhtmltopdf(html, {encoding : "utf-8"}).pipe(res);
		});
});
