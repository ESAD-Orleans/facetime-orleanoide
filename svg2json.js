var fs = require('fs'),
	xml2js = require('xml2js');
var parser = new xml2js.Parser();

parser.addListener('end', function (result) {
	var polygons = result.svg.g[0].polygon,
		polygonsArray = [];
	polygons.forEach(function(p){
		polygonsArray.push(p.$);
	})
	var e = JSON.stringify(polygonsArray);
	fs.writeFile('polygons.json',e,function(err){
		if(err){
			console.log(err);
		}else{
			console.log('Done.');
		}
	})
});

fs.readFile(__dirname + '/elements/orleanoide.svg', function (err, data) {
	parser.parseString(data);
});
