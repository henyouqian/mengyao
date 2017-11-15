const _isLocal = window.location.hostname.indexOf(".com") === -1
// const VIEWPORT_WIDTH = 320
// const VIEWPORT_HEIGHT = 480
// const LOCAL_HOST = "192.168.3.21" //imac pro @home
// const LOCAL_HOST = "192.168.3.3" //macbook pro @home
const LOCAL_HOST = "10.71.13.45" //macbook pro @studio
// const HOST = "rap.erdianzhang.com"

export let conf = {
	isLocal: _isLocal,
	API_HOST: _isLocal
		? "http://"+LOCAL_HOST+":20000"
		: "http://rapapi.erdianzhang.com",
}
