graphmaker = graphmaker || {};

graphmaker.shapes = {

	oval : function(ctx, node) {
		var w = 80;
		var h = 40;
		
		ctx.beginPath();
		ctx.moveTo(node.x-w/2, node.y);
		ctx.lineTo(node.x, node.y+h/2);
		ctx.lineTo(node.x+w/2, node.y);
		ctx.lineTo(node.x, node.y-h/2);
		ctx.closePath();
	},
		
	rect : function(ctx, node) {
		var w = 60;
		var h = 30;
		
		ctx.beginPath();
		ctx.moveTo(node.x-w/2, node.y-h/2);
		ctx.lineTo(node.x+w/2, node.y-h/2);
		ctx.lineTo(node.x+w/2, node.y+h/2);
		ctx.lineTo(node.x-w/2, node.y+h/2);
		ctx.closePath();
	},
		
	roundRect : function(ctx, node) {
		var w = node.width || 60;
		var h = node.height || 30;
		var cr = node.cr || 10; // corner radius
		
		ctx.beginPath();
		ctx.moveTo(node.x-w/2, node.y-h/2+cr);
		ctx.quadraticCurveTo(node.x-w/2, node.y-h/2, node.x-w/2+cr, node.y-h/2);
		ctx.lineTo(node.x+w/2-cr, node.y-h/2);
		ctx.quadraticCurveTo(node.x+w/2, node.y-h/2, node.x+w/2, node.y-h/2+cr);
		ctx.lineTo(node.x+w/2, node.y+h/2-cr);
		ctx.quadraticCurveTo(node.x+w/2, node.y+h/2, node.x+w/2-cr, node.y+h/2);
		ctx.lineTo(node.x-w/2+cr, node.y+h/2);
		ctx.quadraticCurveTo(node.x-w/2, node.y+h/2, node.x-w/2, node.y+h/2-cr);
		ctx.closePath();
	},
		
	circle : function(ctx, node) {
		var r = 20;
		
		ctx.beginPath();
		ctx.moveTo(node.x+r, node.y);
		ctx.arc(node.x, node.y, r, 0, 2*Math.PI, false);
		ctx.closePath();
	},
	
	point : function(ctx, node) {
		ctx.beginPath();
		ctx.closePath();
	}
};

graphmaker.arrays = {
	strokeArray : function(ctx, a1, d) {
		var arrLen = 10; // array length
		var arrWid2 = 5; // array width/2
		
		var a2 = [a1[0] + arrLen*d[0], a1[1] + arrLen*d[1]];
		
		var a3 = [a2[0] - arrWid2*d[1], a2[1] + arrWid2*d[0]];
		var a4 = [a2[0] + arrWid2*d[1], a2[1] - arrWid2*d[0]];
		
		ctx.beginPath();
		ctx.moveTo(a1[0],a1[1]);
		ctx.lineTo(a3[0],a3[1]);
		ctx.lineTo(a4[0],a4[1]);
		ctx.lineTo(a1[0],a1[1]);
		ctx.closePath();
		ctx.fillStyle = "black";
		ctx.stroke();
	},
	
	fillArray : function(ctx, a1, d) {
		var arrLen = 10; // array length
		var arrWid2 = 5; // array width/2
		
		var a2 = [a1[0] + arrLen*d[0], a1[1] + arrLen*d[1]];
		
		var a3 = [a2[0] - arrWid2*d[1], a2[1] + arrWid2*d[0]];
		var a4 = [a2[0] + arrWid2*d[1], a2[1] - arrWid2*d[0]];
		
		ctx.beginPath();
		ctx.moveTo(a1[0],a1[1]);
		ctx.lineTo(a3[0],a3[1]);
		ctx.lineTo(a4[0],a4[1]);
		ctx.lineTo(a1[0],a1[1]);
		ctx.closePath();
		ctx.strokeStyle = "gray";
		ctx.fillStyle = "white";
		ctx.stroke();
		ctx.fill();
	}
};
	
graphmaker.edges = {
	straight : function(x1, y1, x2, y2, d) {
		this.ctx.strokeStyle = "gray";
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.closePath();
		this.ctx.stroke();
		return {srcLabel : [x1, y1], label : [(x1+x2)/2, (y1+y2)/2], dstLabel : [x2, y2], d : d};
	},
	
	rectangular : function(x1, y1, x2, y2, d) {
		this.ctx.strokeStyle = "gray";
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x1, y2);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
		return {srcLabel : [x1, y1], dstLabel : [x2, y2], label : [x1, y2], d : [-1, 0]};
	}
};
