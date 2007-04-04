/*
Script: Utility.js
	Contains Utility functions

License:
	MIT-style license.
*/

/*
Class: Abstract
	Abstract class, to be used as singleton. Will add .extend to any object

Arguments:
	an object

*/

var Abstract = function(obj){
	obj = obj || {};
	obj.extend = $extend;
	return obj;
};

//window, document

var Window = new Abstract(window);
var Document = new Abstract(document);

/*
Function: $chk
	Returns true if the passed in value/object exists or is 0, otherwise returns false.
	Useful to accept zeroes.

Arguments:
	obj - object to inspect
*/

function $chk(obj){
	return !!(obj || obj === 0);
};

/*
Function: $pick
	Returns the first object if defined, otherwise returns the second.

Arguments:
	obj - object to test
	picked - the default to return

Example:
	(start code)
		function say(msg){
			alert($pick(msg, 'no meessage supplied'));
		}
	(end)
*/

function $pick(obj, picked){
	return (obj != undefined) ? obj : picked;
};

/*
Function: $random
	Returns a random integer number between the two passed in values.

Arguments:
	min - integer, the minimum value (inclusive).
	max - integer, the maximum value (inclusive).

Returns:
	a random integer between min and max.
*/

function $random(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
};

/*
Function: $time
	Returns the current timestamp

Returns:
	a timestamp integer.
*/

function $time(){
	return new Date().getTime();
};

/*
Function: $duration
	Returns a time interval in milliseconds from the given time units

Arguments:
	data - Number in milliseconds or seconds (second parameter true) or an Object with values for years, months, days, hours, minutes, seconds, milliseconds
	seconds - Boolean, needs to be true when first argument is a number in seconds, otherwise its handled as milliseconds
	only when first argument is passed as number, if true the first argument is treated as seconds, if false as milliseconds. defaults to false.

Returns:
	The time in milliseconds

Example:
	(start code)
	var howLong = $duration({
		seconds: 3600
	});
	//returns
	3600000
	//same result for $duration(3600, true) or $duration(3600000)
	(end)
*/

function $duration(data, seconds){
	if ($type(data) != 'object'){
		data = parseInt(data, 10);
		data = seconds ? {seconds: data} : {milliseconds: data};
	}
	this.units = this.units || {
		years: 'FullYear', months: 'Month', days: 'Date', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds', milliseconds: 'Milliseconds'
	};
	var date = new Date();
	for (var unit in data){
		var fn = this.units[unit];
		if (fn) date['set' + fn](date['get' + fn]() + $pick(data[unit], 0));
	}
	return date.getTime() - $time();
};

/*
Function: $clear
	clears a timeout or an Interval.

Returns:
	null

Arguments:
	timer - the setInterval or setTimeout to clear.

Example:
	>var myTimer = myFunction.delay(5000); //wait 5 seconds and execute my function.
	>myTimer = $clear(myTimer); //nevermind

See also:
	<Function.delay>, <Function.periodical>
*/

function $clear(timer){
	clearTimeout(timer);
	clearInterval(timer);
	return null;
};

/*
Class: window
	Some properties are attached to the window object by the browser detection.

Properties:
	window.ie - will be set to true if the current browser is internet explorer (any).
	window.ie6 - will be set to true if the current browser is internet explorer 6.
	window.ie7 - will be set to true if the current browser is internet explorer 7.
	window.khtml - will be set to true if the current browser is Safari/Konqueror.
	window.gecko - will be set to true if the current browser is Mozilla/Gecko.
*/

if (window.ActiveXObject) window.ie = window[window.XMLHttpRequest ? 'ie7' : 'ie6'] = true;
else if (document.childNodes && !document.all && !navigator.taintEnabled) window.khtml = true;
else if (document.getBoxObjectFor != null) window.gecko = true;
window.xpath = !!(document.evaluate);

//htmlelement

if (typeof HTMLElement == 'undefined'){
	var HTMLElement = Class.empty;
	if (window.khtml) document.createElement("iframe"); //fixes safari
	HTMLElement.prototype = (window.khtml) ? window["[[DOMElement.prototype]]"] : {};
}
HTMLElement.prototype.htmlElement = true;

//enables background image cache for internet explorer 6

if (window.ie6) try {document.execCommand("BackgroundImageCache", false, true);} catch(e){};