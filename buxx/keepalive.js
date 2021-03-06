var cga = require('../cgaapi')(function(){
	var loop = function(){
		cga.SayWords("头目万岁，法兰永存", 0, 3, 1);
		setTimeout(loop, 30000);
	}
    loop()
}
