var graphmaker = graphmaker || {};

/**
 * @constructor
 */
graphmaker.Vector = function() {};

/**
 * Returns sum of vector a and b
 */
graphmaker.Vector.add = function(a, b) {
	return [ a[0] + b[0], a[1] + b[1] ];
};

/**
 * Returns vectors product
 */
graphmaker.Vector.prod = function(a, b) {
	return [ a[0] * b[0] + a[1] * b[1] ];
};

/**
 * Returns a new vector that is orthogonal to original one
 */
graphmaker.Vector.ort = function(v) {
	return [ -v[1], v[0] ];
};

/**
 * Returns a copy of vector v
 */
graphmaker.Vector.copy = function(v) {
	return [ v[0], v[1] ];
};

/**
 * Multiply vector a by constant b
 */
graphmaker.Vector.dot = function(a, b) {
	return [ a[0] * b, a[1] * b ];
};

/**
 * Returns a vector for given length and angle.
 */
graphmaker.Vector.vector = function(len, angle) {
	return [ len * Math.sin(angle), len * Math.cos(angle) ];
};

/**
 * Returns vector length
 */
graphmaker.Vector.length = function(v) {
	return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
};

/**
 * Returns angle in radians/PI (-1,1)
 */
graphmaker.Vector.angle = function(v) {
	return Math.atan2(v[0], v[1]) / Math.PI;
};
