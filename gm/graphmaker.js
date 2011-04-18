var graphmaker = graphmaker || {};
graphmaker.GraphMaker = function(canvasId) {
	this.elem = document.getElementById(canvasId);
	this.ctx = this.elem.getContext('2d');
	this.width = this.elem.width;
	this.height = this.elem.height;
	this.hover = undefined;
	this.selected = undefined;
	this.dragged = undefined;
	this.dragSource = undefined;
	
	var a = function(ss) { return function (event) { ss.moveHdlr(event, this, ss); }; };
	var f = a(this);
	this.elem.onmousemove = f;
	this.elem.onmousedown = f;
	this.elem.onmouseup = f;
};

graphmaker.GraphMaker.prototype.moveHdlr = function(event, that, gm) {
	var x = event.pageX - that.offsetLeft;
	var y = event.pageY - that.offsetTop;
	
	// drag and drop
	if (gm.dragged !== undefined) {
		// handle dragging selected element
		if (event.type === 'mousemove' && gm.dragged !== undefined) {
			var dx = gm.dragSource[0] - x;
			var dy = gm.dragSource[1] - y;
			gm.dragSource = [x, y];
			
			gm.dragged.x -= dx;
			gm.dragged.y -= dy;
			
			gm.redraw();
			gm.dragInProgress = true;
			return;
		} else if (event.type === 'mouseup' && event.button === 0) {
			gm.dragged = undefined;
			gm.dragSource = undefined;
			if (gm.dragInProgress == true) {
				gm.dragRelease();
				delete gm.dragInProgress;
				return;
			}
		}
	}
	
	// find hovered node
	gm.hover = gm.getObjectAt(gm, x, y);
	
	if (event.button === 0) {		
		if (event.type === 'mouseup') { // update selection
			gm.select(gm.hover);
		} else if (gm.hover && event.type === 'mousedown') { // start drag and drop
			gm.dragSource = [x, y];
			gm.dragged = gm.hover;
		}
	}
	
	gm.redraw();
};

graphmaker.GraphMaker.prototype.getObjectAt = function(gm, x, y) {
	for (var name in gm.graph) {
		var node = gm.graph[name];
		gm.getNodePath(gm.ctx, node);
		if (gm.ctx.isPointInPath(x, y)) {
			return node;
		}
	}
	return undefined;
}

graphmaker.GraphMaker.prototype.select = function(newSel) {
	var oldSel = this.selected;
	this.selected = newSel; //(newSel === this.selected) ? undefined : newSel;
	this.doSelect(this.selected, oldSel);
};

graphmaker.GraphMaker.prototype.dragRelease = function() {
	// empty
}

graphmaker.GraphMaker.prototype.doSelect = function(newSel, oldSel) {
	// empty
}

graphmaker.GraphMaker.prototype.setInput = function(graph) {
	this.graph = graph;
};

graphmaker.GraphMaker.prototype.draw = function() {
	this.drawAllEdges();
	this.drawAllNodes();
};

graphmaker.GraphMaker.prototype.redraw = function() {
	this.clear();
	this.draw();
}

graphmaker.GraphMaker.prototype.drawAllNodes = function() {
	for (var name in this.graph) {
		var node = this.graph[name];
		this.drawNode(node);
	}
};

graphmaker.GraphMaker.prototype.drawNode = function(node) {
	if (node.invisible) {
		return;
	};
	this.getNodePath(this.ctx, node);
	this.paintNode(this.ctx, node, {
		isSelected : node === this.selected,
		isHover : node === this.hover
	});	
};

/**
 * Draws node contents.
 */
graphmaker.GraphMaker.prototype.paintNode = function(ctx, node, attrs) {
	ctx.save();
	ctx.lineWidth = 0;
	ctx.shadowBlur = 3;
	ctx.shadowColor = "gray";
	ctx.fillStyle = "rgb(255, 255,255)";
	
	if (attrs.isSelected) {
		ctx.lineWidth = 3;
	} else if (attrs.isHover) {
		ctx.shadowColor = "black";
	} else {
		ctx.strokeStyle = "rgb(0,0,0)";
	}
	// Create fill gradient
	var gradient = ctx.createLinearGradient(node.x, node.y-30, node.x, node.y+30);
	gradient.addColorStop(0, "#acf");
	gradient.addColorStop(1, "#fff");
	
		
	// Fill the path
	ctx.fillStyle = gradient;
	ctx.fill();
	ctx.restore();
	
	ctx.font = "100 8pt Verdana";
	var m = ctx.measureText(node.label);
	ctx.fillText(node.label, node.x-m.width/2, node.y);
};

/**
 * Draws node's outgoing edges.
 * 
 * @param node Node with outgoing edges. Outgoing are in node.out
 * @param opts Options, opts.redrawNodes to force redraw target nodes
 */
graphmaker.GraphMaker.prototype.drawNodeEdges = function(node, opts) {
	if (!node.out) {
		return;
	}
	
	for (toNode in node.out) {
		var edgeProps = node.out[toNode];
		var outNode = this.graph[toNode];
		this.drawEdge(node, outNode, edgeProps);
		opts && opts.redrawNodes && this.drawNode(outNode);
	}
};

/**
 * Draws all edges.
 * 
 * @param opts extra options, see {@drawNodeEdges()}
 */
graphmaker.GraphMaker.prototype.drawAllEdges = function(opts) {
	for (var name in this.graph) {
		this.drawNodeEdges(this.graph[name], opts);
	}
};

/**
 * Draws edge from src to dest together with arrow. Both, source and
 * destination are vectors [x, y].
 * 
 * @param src source
 * @param dest destination 
 */
graphmaker.GraphMaker.prototype.drawEdge = function(src, dest, properties) {
	properties = properties || {};
	this.getNodePath(this.ctx, dest);
	var a1 = [dest.x, dest.y];
	
	var d = [src.x - dest.x, src.y - dest.y];
	var l = Math.sqrt(d[0]*d[0] + d[1]*d[1]);
	
	if (l == 0) {
		return; // edge to self
	}
	d = [d[0]/l, d[1]/l];
	
	var r = 10; // object's radius
	while (this.ctx.isPointInPath(a1[0],a1[1])) {
		r += 2;
		a1[0] = dest.x + r*d[0];
		a1[1] = dest.y + r*d[1];
	}
	
	this.ctx.save();
	var arrayDetails = this.drawEdgePath(src.x, src.y, a1[0], a1[1], d);
	this.drawEdgeLabels(properties, arrayDetails);
	this.drawArray(this.ctx, a1, arrayDetails.d);
	this.ctx.restore();
};

graphmaker.GraphMaker.prototype.drawEdgeLabels = function(properties, details) {
	this.ctx.font = "100 8pt Verdana";
	this.ctx.fillStyle = "rgb(90,90,90)";
	this.ctx.textAlign = "left";
	this.ctx.textBaseline = "top";
	if (properties.srcLabel) {
		this.ctx.fillText(properties.srcLabel, details.srcLabel[0], details.srcLabel[1]);
	}
	if (properties.label) {
		this.ctx.fillText(properties.label, details.label[0], details.label[1]);
	}
	if (properties.dstLabel) {
		this.ctx.fillText(properties.dstLabel, details.dstLabel[0], details.dstLabel[1]);
	}
};

graphmaker.GraphMaker.prototype.drawEdgePath = graphmaker.edges.rectangular;
graphmaker.GraphMaker.prototype.drawArray = graphmaker.arrays.fillArray;

/**
 * Draws node path on provided 2d context.
 * 
 * @param ctx
 * @param node
 * @returns
 */
graphmaker.GraphMaker.prototype.getNodePath = function(ctx, node) {
	var r = 20;
	
	ctx.beginPath();
	ctx.moveTo(node.x+r, node.y);
	ctx.arc(node.x, node.y, r, 0, 2*Math.PI, false);
	ctx.closePath();
};

/**
 * Clears canvas
 */
graphmaker.GraphMaker.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};

/**
 * Size of js associative array
 * 
 * @returns {Number}
 */
graphmaker.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};



