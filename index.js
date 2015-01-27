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
	var HOUR_IN_SECONDS = 3600,
		HOUR_IN_MS = HOUR_IN_SECONDS*1000,
		DAY_IN_SECONDS = HOUR_IN_SECONDS*24,
		DAY_IN_MS = DAY_IN_SECONDS*1000,
		SPEED = 1,
		PLAYING_STATE = true,
		PLAYING = true;
	//
	var polygons,
		canvas,
		context,
		seconds = $('#seconds'),
		speed = $('#speed'),
		playing = $('#playing'),

		time = 0
		;
		//
	$.ajax({url:'polygons.json',dataType:'json'}).done(function(res){
		polygons = res;
		Setup();
	});
	//
	speed.on('change',function(){
		SPEED = speed.val();
	})
	//
	function Setup(){
		canvas = $('canvas').get(0);
		context = canvas.getContext('2d');
		var PointsExpr = /(([0-9.-]*),([0-9.-]*))/g;
		Math.seedrandom('this is a random seed !');
		$(polygons).each(function(){
			var points = [];
			$(this.points.split(' ')).each(function(p){
				var point = this.split(','),
					x = parseFloat(point[0]),
					y = parseFloat(point[1])
				if(x && y){
					points[p] = {x:x,y:y};
				}
			});
			this.center = {x:canvas.width*Math.random(),y:canvas.height*Math.random()};
			this.points = points;
			context.beginPath();
			context.fillStyle = this.fill;
			context.moveTo(this.points[0].x,this.points[0].y)
			$(this.points).each(function(){
				context.lineTo(this.x,this.y);
			});
			context.closePath();
			context.fill();
		});
		playing.on('change',function(){
			PLAYING_STATE = PLAYING;
			PLAYING = playing.is(':checked');
			Draw();
		});
		Draw();
	}
	function Draw(){
		UpdateTimer();
		context.clearRect(0,0,canvas.width,canvas.height);
		var rX = (time%(HOUR_IN_MS))/ HOUR_IN_MS;
		//
		$(polygons).each(function () {
			var polygon = this;
			context.save();
			context.beginPath();
			context.fillStyle = this.fill;
			context.translate(this.center.x,this.center.y);
			context.rotate(rX*2*Math.PI*SPEED);
			context.moveTo(this.points[0].x-polygon.center.x, this.points[0].y- polygon.center.y);
			$(this.points).each(function () {
				context.lineTo(this.x- polygon.center.x, this.y- polygon.center.y);
			});
			context.closePath();
			context.fill();
			context.restore();
		});
		if(PLAYING){
			window.requestAnimationFrame(Draw);
		}
	}
	function UpdateTimer(){
		time = Date.now()%(DAY_IN_MS);
		seconds.val(parseInt((time/1000)% HOUR_IN_SECONDS));
	}

});