import {conf} from './conf'

// let base64 = {
// 	// private property
// 	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",

// 	// public method for encoding
// 	encode (input) {
// 		var output = "";
// 		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
// 		var i = 0;

// 		input = this._utf8_encode(input);

// 		while (i < input.length) {

// 			chr1 = input.charCodeAt(i++);
// 			chr2 = input.charCodeAt(i++);
// 			chr3 = input.charCodeAt(i++);

// 			enc1 = chr1 >> 2;
// 			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
// 			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
// 			enc4 = chr3 & 63;

// 			if (isNaN(chr2)) {
// 				enc3 = enc4 = 64;
// 			} else if (isNaN(chr3)) {
// 				enc4 = 64;
// 			}

// 			output = output +
// 			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
// 			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
// 		}

// 		return output;
// 	},

// 	// public method for decoding
// 	decode (input) {
// 		let output;
// 		let chr1, chr2, chr3;
// 		let enc1, enc2, enc3, enc4;
// 		let i = 0;

// 		input = input.replace(/[^A-Za-z0-9+/=]/g, "");

// 		while (i < input.length) {

// 			enc1 = this._keyStr.indexOf(input.charAt(i++));
// 			enc2 = this._keyStr.indexOf(input.charAt(i++));
// 			enc3 = this._keyStr.indexOf(input.charAt(i++));
// 			enc4 = this._keyStr.indexOf(input.charAt(i++));

// 			chr1 = (enc1 << 2) | (enc2 >> 4);
// 			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
// 			chr3 = ((enc3 & 3) << 6) | enc4;

// 			output += String.fromCharCode(chr1);

// 			if (enc3 !== 64) {
// 				output += String.fromCharCode(chr2);
// 			}
// 			if (enc4 !== 64) {
// 				output += String.fromCharCode(chr3);
// 			}

// 		}

// 		output = this._utf8_decode(output);

// 		return output;

// 	},

// 	// private method for UTF-8 encoding
// 	_utf8_encode (string) {
// 		string = string.replace(/\r\n/g,"\n");
// 		var utftext = "";

// 		for (var n = 0; n < string.length; n++) {

// 			var c = string.charCodeAt(n);

// 			if (c < 128) {
// 				utftext += String.fromCharCode(c);
// 			}
// 			else if((c > 127) && (c < 2048)) {
// 				utftext += String.fromCharCode((c >> 6) | 192);
// 				utftext += String.fromCharCode((c & 63) | 128);
// 			}
// 			else {
// 				utftext += String.fromCharCode((c >> 12) | 224);
// 				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
// 				utftext += String.fromCharCode((c & 63) | 128);
// 			}

// 		}

// 		return utftext;
// 	},

// 	// private method for UTF-8 decoding
// 	_utf8_decode (utftext) {
// 		var string = "";
// 		var i = 0
// 		let c = 0
// 		let c3 = 0
// 		let c2 = 0

// 		while ( i < utftext.length ) {

// 			c = utftext.charCodeAt(i);

// 			if (c < 128) {
// 				string += String.fromCharCode(c);
// 				i++;
// 			}
// 			else if((c > 191) && (c < 224)) {
// 				c2 = utftext.charCodeAt(i+1);
// 				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
// 				i += 2;
// 			}
// 			else {
// 				c2 = utftext.charCodeAt(i+1);
// 				c3 = utftext.charCodeAt(i+2);
// 				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
// 				i += 3;
// 			}

// 		}
// 		return string;
// 	}
// }

export let util = {
	isLocal: conf.isLocal,
	now() {
		let d = new Date()
		return d.getTime()
	},
	nowSec(){
		return Math.floor(this.now() / 1000)
	},
	isEmptyObj(obj){
		return Object.getOwnPropertyNames(obj).length === 0
	},
	isTouchDevice() {
		try {
			document.createEvent("TouchEvent");
			return true;
		} catch (e) {
			return false;
		}
	},
	isWeixin() {
		let ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i)==="micromessenger") {
			return true;
		} else {
			return false;
		}
	},
	getRandom(min, max){
	  return Math.random() * (max - min) + min
	},
	getRandomInt(min, max){
	  return Math.floor(Math.random() * (max - min + 1)) + min
	},
	onTouchStart(jqObj, callback){
		if (this.isTouchDevice()) {
			jqObj.on("touchstart", (evt)=>{
				callback(evt)
			})
		} else {
			jqObj.on("mousedown", (evt)=>{
				callback(evt)
			})
		}
	},
	oneTouchStart(jqObj, callback){
		if (this.isTouchDevice()) {
			jqObj.one("touchstart", ()=>{
				callback()
			})
		} else {
			jqObj.one("mousedown", ()=>{
				callback()
			})
		}
	},
	offTouchStart(jqObj){
		if (this.isTouchDevice()) {
			jqObj.off("touchstart")
		} else {
			jqObj.off("mousedown")
		}
	},
	onTouchEnd(jqObj, callback){
		if (this.isTouchDevice()) {
			jqObj.on("touchend", ()=>{
				callback()
			})
		} else {
			jqObj.on("mouseup", ()=>{
				callback()
			})
		}
	},
	
	post(url, data, succeedFunc, errorFunc){
		// this.checkAuthLocal()
		if (data == null) {
			data = {}
		}
		// Object.assign(data,{UserToken:lscache.get("userToken")})

		this.postRaw(url, data, succeedFunc, (resp)=>{
			if (resp.Type === "err_auth") {
				// alert("重新登录, 请确认")
				this.login()
			} else {
				if (errorFunc) {
					errorFunc(resp)
				} else {
					console.error("postErr: ", resp)
				}
			}
		})
		// lscache.set("userTokenShortHeart", "❤", SHORT_HEART_MINUTE)
	},
	postRaw(url, data, succeedFunc, errorFunc){
		if (typeof(data) === "object") {
			data = JSON.stringify(data)
		}
		var xhr = new XMLHttpRequest()
		xhr.withCredentials = true
		xhr.onreadystatechange=function(){
			if (xhr.readyState === 4) {
				var resp = ""
				if (xhr.responseText) {
					resp = JSON.parse(xhr.responseText)
				}
				
				if (xhr.status === 200) {
					succeedFunc(resp)
				} else {
					if (errorFunc) {
						errorFunc(resp)
					} else {
						console.error("postErr: ", resp)
					}
				}
			}
		}
		xhr.open("POST", url, true)
		xhr.send(data)
	},
	postApi(api, data, succeedFunc, errorFunc){
		let url = conf.API_HOST+"/"+api
		this.post(url, data, succeedFunc, errorFunc)
	},
	postApiRaw(api, data, succeedFunc, errorFunc){
		let url = conf.API_HOST+"/"+api
		this.postRaw(url, data, succeedFunc, errorFunc)
	},
	copyObj(obj) {
		return JSON.parse(JSON.stringify(obj))
	},
	makeSearchMap(search) {
		let strs = search.substr(1).split("&")
		let map = {}
		strs.forEach((str)=>{
			let s = str.split("=")
			map[s[0]] = s[1]
		})
		return map
	},
}

//================================
function loadScript(src, onload) {
	var verScript = document.createElement('script')
	verScript.type = 'text/javascript'
	verScript.async = true
	verScript.src = src
	verScript.onload = function() {
		onload && onload()
	}
	document.body.appendChild(verScript)
}

function checkVer() {
	loadScript("ver.js?"+util.now(), ()=>{
		let sm = util.makeSearchMap(window.location.search)
		let ver = parseInt(sm.ver, 10)
		if (ver !== window.ver) {
			window.location.replace("/?ver="+window.ver+window.location.hash)
		} else {
			// initWeixin()
		}
	})
}
checkVer()

