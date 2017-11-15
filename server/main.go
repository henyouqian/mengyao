// liwei

package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"runtime"
	"time"

	"github.com/golang/glog"
)

func _mainGlog() {
	glog.Info("")
}

func regAPI() {
	http.Handle("/ajaxGet", ReqHandler(apiAjaxGet))
}

func main() {
	flag.Parse()

	runtime.GOMAXPROCS(10)
	rand.Seed(time.Now().UnixNano())

	regAPI()

	glog.Infof("Server running: cpu=%d, port=%d", runtime.NumCPU(), SERVER_PORT)
	serverPort := fmt.Sprintf(":%d", SERVER_PORT)
	err := http.ListenAndServe(serverPort, nil)
	if err != nil {
		glog.Fatal("ListenAndServe: ", err)
	}
}

func apiAjaxGet(w http.ResponseWriter, r *http.Request) {
	//in
	var in struct {
		Url string `json:"url"`
	}
	err := DecodeRequestBody(r, &in)
	CheckError(err, "err_decode_body")

	if in.Url == "" {
		SendError("err_url")
	}

	//
	resp, err := httpGet(in.Url)
	CheckError(err, "err_http_get")
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	CheckError(err, "err_io_read")

	// out
	out := OutMsg{
		"data": string(body),
	}
	WriteResponse(w, out)
}
