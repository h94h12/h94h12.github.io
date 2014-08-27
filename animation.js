do_rain = function(can, div) {
	var ctx = can.getContext("2d");
	can.width = $(div).width();
	can.height = $(div).height();

	var radius = 2;
	var boundary = radius + (2 * step);
	var ground = (5/6) * can.height; 
	
	var colors = ["#191919", "#323232", "#4c4c4c", "#666666", "#7f7f7f", "#999999", "#b2b2b2", "#cccccc", "#e0e0e0",  "#eaeaea", "#f4f4f4"];   
	var make_rain = function(x, y) {
		/*ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2, false);
		ctx.closePath();
		ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
		ctx.stroke();*/
		ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
		ctx.fillRect(x, y, 1, 10); 
		
	}
	
	var make_ripple = function (x, y, l){
		
		if (l > 0)
		{
		ctx.save();
		ctx.scale(1, 0.5);
		ctx.beginPath();
		ctx.arc(x, 2*y, 150/l, 0, Math.PI*2, false);
		ctx.strokeStyle = colors[l-1];
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		}
	}

	var randVec = function() {
		return (Math.random() > .5) ? 1 : -1;
	}

	var state = [];
	init = function() {
		state.push({type: "drop", 
			xvec: randVec(), yvec: 1,
			x: Math.random()*can.width, y: Math.random()*ground,
		} );
	}

	var draw_state = function() {
		ctx.clearRect(0, 0, can.width, can.height);
		for (var i = 0; i < state.length; i++) {
			var obj = state[i];
			if (obj.type === "ripple"){
			make_ripple(obj.x, obj.y, obj.lifetime); 	
			}
			else if (obj.type === "drop"){
			make_rain(obj.x, obj.y);
			}
			
		}
	}

	var step = 10;
	shift_object = function(obj) {
		obj.y = obj.y + (step * obj.yvec);
	}

	repel_object = function(obj) {
		obj.xvec = -obj.xvec;
		obj.yvec = -obj.yvec;
		for (var z = 0; z < 2; z++) {
			shift_object(obj);
		}
	}

	var add_ripple = function(x, y){
		state.push({type: "ripple",
		xvec: 0, yvec: 0, lifetime: colors.length, x: x, y: y
		
		});
		
	}


	
	var update_state = function() {
		for (var i = 0; i < state.length; i++) {
			var obj = state[i];
			if(obj.type === "drop"){
				
				
				if (obj.y >= ground)
				{
					add_ripple(obj.x, obj.y); 
					obj.y = 0; 
					
					 
				}
				
				shift_object(obj);
			}
			else if (obj.type === "ripple"){
				if (obj.lifetime > 0)
				{
					obj.lifetime = obj.lifetime	- 1; 
				}
				else
				{
					state.splice(i, 1); 	
					i--; 
				}
			}
		}
	}

	init();
	draw_state();
	var freq = 150;
	loop = function() {
		
		update_state();
		draw_state(); 
		setTimeout("loop()", freq);
	}
	
	make_new = function() {
		if (!hasStarted) {
			loop();
			hasStarted = true;
			return;
		}
		setTimeout("init()", 8);
	}

	var hasStarted = false;
	$(can).ready(function() {
		for (var k = 0; k < 50; k++){
			
			make_new(); 
		}
		
	});
	

}

do_rain($("#stuff")[0], $("#box")[0]);
