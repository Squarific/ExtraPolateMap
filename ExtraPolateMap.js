if (typeof brain !== "object") {
	throw "Brain.js required";
}

var SQUARIFIC = SQUARIFIC || {};

SQUARIFIC.ExtraPolateMap = function ExtraPolateMap (data, coorddata, settings, colors) {
	settings = settings || {};
	
	var time = Date.now();
	var net = new brain.NeuralNetwork(settings);
	console.log("Network trained: " + JSON.stringify(net.train(data, settings)));
	console.log("Net: ", net.toJSON());
	console.log("It took: " + (Date.now() - time));
	
	this.getColor = function getColor (value) {
		for (var k = 0; k < colors.length; k++) {
			if (value <= colors[k].max) {
				return colors[k];
			}
		}
		return {r: 0, g: 0, b: 0};
	};
	
	this.draw = function draw (canvas, cx, cy) {
		var ctx = canvas.getContext("2d");
		var pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (var x = 0; x < canvas.width; x++) {
			for (var y = 0; y < canvas.height; y++) {
				var k = y * canvas.width * 4 + x * 4;
				var c = net.run([x / canvas.width, y / canvas.height]) * 255;
				pixelData.data[k    ] = c;
				pixelData.data[k + 1] = c;
				pixelData.data[k + 2] = c;
				pixelData.data[k + 3] = 255;
			}
		}
		ctx.putImageData(pixelData, 0, 0);
		return this;
	};
	
	this.drawInput = function drawInput (canvas, cx, cy) {
		var ctx = canvas.getContext("2d");
		var pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (var d = 0; d < data.length; d++) {
			var k = coorddata[d].y * canvas.width * 4 + coorddata[d].x * 4;
			pixelData.data[k    ] = Math.round(255 - coorddata[d].output * 255);
			pixelData.data[k + 1] = Math.round(255 - coorddata[d].output * 255);
			pixelData.data[k + 2] = Math.round(255 - coorddata[d].output * 255);
			pixelData.data[k + 3] = 255;
		}
		ctx.putImageData(pixelData, 0, 0);
		return this;
	};
};
