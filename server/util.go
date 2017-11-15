package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"runtime"
	// "strconv"
	"strings"
	"time"

	"github.com/golang/glog"
)

var (
	DEBUG = false
)

const (
	LOCAL = runtime.GOOS == "darwin"
)

type OutMsg map[string]interface{}

func init() {
	DEBUG = LOCAL
}

type Err struct {
	Type string
	Desc string
	Log  bool
}

func (e Err) Error() string {
	return fmt.Sprintf("%v: %v", e.Type, e.Desc)
}

func handleHttpError(w http.ResponseWriter) {
	if r := recover(); r != nil {
		encoder := json.NewEncoder(w)

		var err Err
		logStr := ""
		switch r.(type) {
		case Err:
			err = r.(Err)
			logStr = fmt.Sprintf("%v", err)
		default:
			err = Err{"", fmt.Sprintf("%v", r), false}
			buf := make([]byte, 1024)
			runtime.Stack(buf, false)
			logStr = fmt.Sprintf("%v\n%s\n", r, buf)
		}

		if err.Type == "" {
			err.Type = "err_internal"
			w.WriteHeader(http.StatusInternalServerError)
		} else {
			w.WriteHeader(http.StatusBadRequest)
		}

		if DEBUG || err.Log {
			glog.Errorln(logStr)
		}

		encoder.Encode(&err)
	}
}

func handleRecover(r interface{}) {
	var err Err
	logStr := ""
	switch r.(type) {
	case Err:
		err = r.(Err)
		logStr = fmt.Sprintf("%v", err)
	default:
		err = Err{"", fmt.Sprintf("%v", r), true}
		buf := make([]byte, 2048)
		runtime.Stack(buf, false)
		logStr = fmt.Sprintf("%v\n%s\n", r, buf)
	}

	if err.Type == "" {
		err.Type = "err_internal"
	}

	if DEBUG || err.Log {
		glog.Errorln(logStr)
	}
}

func handleError() {
	if r := recover(); r != nil {
		var err Err
		logStr := ""
		switch r.(type) {
		case Err:
			err = r.(Err)
			logStr = fmt.Sprintf("panic: %v", err)
		default:
			err = Err{"", fmt.Sprintf("%v", r), true}
			buf := make([]byte, 2048)
			runtime.Stack(buf, false)
			logStr = fmt.Sprintf("panic: %v\n%s\n", r, buf)
		}

		if err.Type == "" {
			err.Type = "err_internal"
		}

		if DEBUG || err.Log {
			glog.Errorln(logStr)
		}
	}
}

func handleErrorCb(cb func(Err)) {
	if r := recover(); r != nil {
		var err Err
		logStr := ""
		switch r.(type) {
		case Err:
			err = r.(Err)
			logStr = fmt.Sprintf("%v", err)
		default:
			err = Err{"", fmt.Sprintf("%v", r), true}
			buf := make([]byte, 2048)
			runtime.Stack(buf, false)
			logStr = fmt.Sprintf("%v\n%s\n", r, buf)
		}

		if err.Type == "" {
			err.Type = "err_internal"
		}

		if DEBUG || err.Log {
			glog.Errorln(logStr)
		}
		cb(err)
	}
}

func CheckError(err error, errType string) {
	if err == nil {
		return
	}
	_, file, line, _ := runtime.Caller(1)
	errStr := fmt.Sprintf("%s\n\t%s : %d", err.Error(), ShortenFileName(file), line)
	panic(Err{errType, errStr, false})
}

func SendError(errType string) {
	_, file, line, _ := runtime.Caller(1)
	errStr := fmt.Sprintf("%s : %d", ShortenFileName(file), line)
	panic(Err{errType, errStr, false})
}

func ShortenFileName(fileName string) string {
	idx := strings.LastIndex(fileName, "/")
	if idx != -1 {
		fileName = fileName[(idx + 1):]
	}
	return fileName
}

type ReqHandler func(http.ResponseWriter, *http.Request)

func (fn ReqHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	defer handleHttpError(w)
	if r.Method != "POST" {
		SendError("err_method_not_allowed")
	}
	setHttpHeaderOrigin(w, r)
	fn(w, r)
}

func setHttpHeaderOrigin(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	if strings.Index(origin, ".erdianzhang.com") > 0 || isLocal() {
		w.Header().Set("Access-Control-Allow-Origin", origin)
	}

	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "X-Requested-With")
	w.Header().Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
	w.Header().Set("Cache-Control", "no-cache")
}

func DecodeRequestBody(r *http.Request, v interface{}) error {
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(v)
	return err
}

func WriteResponse(w http.ResponseWriter, v interface{}) {
	encoder := json.NewEncoder(w)
	encoder.Encode(v)
}
func httpGet(url string) (*http.Response, error) {
	runtime.Gosched()
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	req.Close = true
	resp, err := client.Do(req)
	return resp, err
}

func Now() time.Time {
	return time.Now()
}

func isLocal() bool {
	return runtime.GOOS == "darwin"
}
