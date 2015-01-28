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
		//
		IMAGE_WIDTH = 1920,
		IMAGE_HEIGHT = 1080,
		//
		timeOffset = 0,
		//
		//
		SPEEDS = [1,12,720],
		//
		// starting values
		SPEED = 2,
		TIME_OFFSET = new Date(2015,0,29,0,0,0,0).getTime() % (DAY_IN_MS / SPEED),
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
		framerate = $('#framerate'),
		fpsUpdateDisplayPerSecond = 4,
		fpsVal = 0,
		fpsCount = 0,
		scale = 1,
		scaleX = 1, scaleY = 1,

		time = 0
		;
		//
	// polygons data ajax loading
	$.ajax({url:'polygons.json',dataType:'json'}).done(function(res){
		polygons = res;
		Setup();
	});
	//
	// Resize
	function Resize(){
		//
		canvas.width = $(canvas).width();
		canvas.height = $(canvas).height();
		//
		scaleX = canvas.width/IMAGE_WIDTH;
		scaleY = canvas.height/IMAGE_HEIGHT;
		scale = scaleY;
		//scale = scaleX > scaleY ? scaleX : scaleY;
	}
	//
	$('button').click(function(){
		timeOffset = $(this).is('.offsetReset') ? (new Date()).getTime()%(DAY_IN_MS/SPEED) : TIME_OFFSET;
		console.log(timeOffset)
		return false;
	})
	//
	// App Setup, after polygons data loading
	function Setup(){
		//
		// setup the canvas
		canvas = $('canvas').get(0);
		context = canvas.getContext('2d');
		$('button.realtime').click();
		//
		//
		$(window).resize(Resize);
		Resize();
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
			this.group = Math.floor(Math.random()* SPEEDS.length);
			//
			// assign a random center to the polygon
			this.center = {x:IMAGE_WIDTH*Math.random(),y:IMAGE_HEIGHT*Math.random()};
			//
		});
		//
		// initial Drawing
		Draw();
	}
	function Draw(){
		UpdateTimer();
		context.clearRect(0,0,canvas.width,canvas.height);
		var rX = SPEED * (time%(DAY_IN_MS))/ DAY_IN_MS;
		//rX = 0;
		//
		//
		// draw All triangles
		$(polygons).each(function () {
			//
			var polygon = this;
			context.save();

			//
			context.translate(canvas.width / 2, canvas.height / 2);
			context.scale(scale, scale);
			context.translate(-IMAGE_WIDTH / 2, -IMAGE_HEIGHT / 2);
			//

			context.beginPath();
			context.fillStyle = polygon.fill;
			context.translate(polygon.center.x, polygon.center.y);
			context.rotate(rX*2*Math.PI*SPEEDS[polygon.group]);
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
		var lastTime = time;
		time = (Date.now()- timeOffset)%(DAY_IN_MS);
		//console.log(time, DAY_IN_SECONDS);
		var renderTime = time-lastTime;
		fpsCount ++;
		fpsVal += renderTime;
		if(fpsVal>1000/fpsUpdateDisplayPerSecond){
			framerate.text(Math.round(fpsCount * fpsUpdateDisplayPerSecond));
			fpsVal %= fpsVal % (1000/fpsUpdateDisplayPerSecond);
			fpsCount = 0;
		}
	}

});