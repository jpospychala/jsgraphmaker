var graphmaker = graphmaker || {};

/**
 * @constructor
 */
graphmaker.layouts = function() {};

/**
 * Lays the nodes on a grid
 */
graphmaker.layouts.grid = function(graph, params) {
	params = params || graphmaker.layouts.grid.Params;
	
	var x = params.margin;
	var y = params.margin;
	for (var name in graph) {
		var node = graph[name];
		node.x = x;
		node.y = y;
		
		x += params.nodeWidth;
		if (x >= params.width) {
			x = params.margin;
			y += params.rowHeight;
		}
	}
};

/**
 * Grid layout params
 */
graphmaker.layouts.grid.Params = {
		margin : 50, 
		nodeWidth : 80,
		rowHeight : 50,
		width : 400
};

graphmaker.layouts.circle = function(graph, params) {
	params = params || graphmaker.layouts.circle.Params;
	
	var r = params.width/2;
	var x = params.margin + r;
	var y = params.margin + r;
	
	var count = 0;
	for (var n in graph) {
		count++;
	}
	
	var i = 0;
	for (var name in graph) {
		var node = graph[name];
		node.x = x + r * Math.sin((i/count)*2*Math.PI);
		node.y = y + r * Math.cos((i/count)*2*Math.PI);
		i++;
	}	
};

graphmaker.layouts.circle.Params = {
		margin : 20,
		width : 260
};

graphmaker.layouts.flow = function(graph, params) {
	params = params || graphmaker.layouts.flow.Params;
	
	// get starting nodes
	var all = {};
	var dest = {};
	for (var name in graph) {
		var node = graph[name];
		all[name] = node;
		node.x = 0;
		node.y = 0;
		if (node.out) {
			for (var outName in node.out) {
				dest[outName] = graph[outName];
			}
		}
	}
	for (var name in dest) {
		delete all[name];
	}
	
	// layout each layer
	var nextIsEmpty;
	var level = 0;
	var maxWid = 1;
	do {
		var next = {};
		var i = 0;
		nextIsEmpty = true;
		for (var name in all) {
			var node = graph[name];
			node.x = params.margin + level * params.levelDist;
			node.y = params.margin + i * params.rowHeight;
			i++;
			if (node.out) {
				for (var outName in node.out) {
					next[outName] = graph[outName];
					nextIsEmpty = false;
				}
			}
		}
		for (var name in all) {
			var node = graph[name];
			node.levelCount = i;
			delete all[name];
		}
		maxWid = Math.max(maxWid,i);
		all = next;
		level++;
	} while (!nextIsEmpty);
	
	// align nodes to the center of widest level
	for (var name in graph) {
		var node = graph[name];
		if (node.levelCount) {
			node.y += ((maxWid - node.levelCount) / 2) * params.rowHeight;
			delete node.levelCount;
		}
	}
};

graphmaker.layouts.flow.Params = {
		margin : 20,
		levelDist : 150,
		rowHeight : 75
};