// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();
//

$(document).ready(function(){
	//
	// constants
	var HOUR_IN_SECONDS = 3600,
		HOUR_IN_MS = HOUR_IN_SECONDS*1000,
		DAY_IN_SECONDS = HOUR_IN_SECONDS*24,
		DAY_IN_MS = DAY_IN_SECONDS*1000,
		//
		// starting values
		SPEED = 1,
		PLAYING_STATE = true,
		PLAYING = true;
	//
	// random seed
	Math.seedrandom('this is a random seed !');
	//
	// vars
	var polygons,
		canvas,
		context,
		seconds = $('#seconds'),
		speed = $('#speed'),
		playing = $('#playing'),

		time = 0
		;
		//
	// polygons data ajax loading
	$.ajax({url:'polygons.json',dataType:'json'}).done(function(res){
		polygons = res;
		Setup();
	});
	//
	// input change binding
	speed.on('change',function(){
		SPEED = speed.val();
	})
	//
	// App Setup, after polygons data loading
	function Setup(){
		//
		// setup the canvas
		canvas = $('canvas').get(0);
		context = canvas.getContext('2d');
		//
		// display in browser console the number of triangles
		console.log($(polygons).length);
		//
		$(polygons).each(function(){
			//
			// convert string data to floating number points array
			var points = [];
			$(this.points.split(' ')).each(function(p){
				var point = this.split(','),
					x = parseFloat(point[0]),
					y = parseFloat(point[1])
				if(x && y){
					points[p] = {x:x,y:y};
				}
			});
			this.points = points;
			//
			// assign a random center to the polygon
			this.center = {x:canvas.width*Math.random(),y:canvas.height*Math.random()};
			//
		});
		//
		// bind playing button
		playing.on('change',function(){
			PLAYING_STATE = PLAYING;
			PLAYING = playing.is(':checked');
			Draw();
		});
		//
		// initial Drawing
		Draw();
	}
	function Draw(){
		UpdateTimer();
		context.clearRect(0,0,canvas.width,canvas.height);
		var rX = (time%(HOUR_IN_MS))/ HOUR_IN_MS;
		//
		// draw All triangles
		$(polygons).each(function () {
			//
			var polygon = this;
			context.save();
			context.beginPath();
			context.fillStyle = polygon.fill;
			context.translate(polygon.center.x, polygon.center.y);
			context.rotate(rX*2*Math.PI*SPEED);
			context.moveTo(this.points[0].x-polygon.center.x, this.points[0].y- polygon.center.y);
			$(this.points).each(function () {
				context.lineTo(this.x- polygon.center.x, this.y- polygon.center.y);
			});
			context.closePath();
			context.fill();
			context.restore();
		});
		//
		// if PLAYING, then Draw again, and again !!!
		if(PLAYING){
			window.requestAnimationFrame(Draw);
		}
	}
	function UpdateTimer(){
		//
		// update the timeline and time
		time = Date.now()%(DAY_IN_MS);
		seconds.val(parseInt((time/1000)% HOUR_IN_SECONDS));
	}

});