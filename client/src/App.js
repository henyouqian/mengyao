import React, { Component } from 'react';
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'

import {util} from './util'

import './App.css';

const ITEM_QUERY_NUM = 100

// let {$} = window

let _d = {
	showResult: false,
	results:[],
	queryStr: `1211680，雪地靴女短筒，可爱
1211680，哈哈哈`,
}

class App extends Component {
	componentDidMount() {
		// $.get('http://apiv4.yangkeduo.com/search?q=%E9%9B%AA%E5%9C%B0%E9%9D%B4%E5%A5%B3%E7%9F%AD%E7%AD%92%20%E5%8F%AF%E7%88%B1&page=1&size=50&requery=0&sort=default&pdduid=0', function(data) {
		//   console.log(data)
		// });
		// let url = "http://apiv4.yangkeduo.com/search?q=%E9%9B%AA%E5%9C%B0%E9%9D%B4%E5%A5%B3%E7%9F%AD%E7%AD%92%20%E5%8F%AF%E7%88%B1&page=1&size=50&requery=0&sort=default&pdduid=0"
		// let req = {
		// 	url: url,
		// }
		// util.postApi("ajaxGet", req, (resp)=>{
		// 		let data = JSON.parse(resp.data)
		// 		console.log(data)
		// })
	}

	render() {
		let requestView = (
			<div className="fullScreenView">
				<textarea className="inputArea" ref="inputArea" defaultValue={_d.queryStr} onChange={()=>{_d.queryStr = this.refs.inputArea.value}}>
				</textarea>
				<div className="bottomRow">
					<button onClick={this.submit.bind(this)}>查询</button>
				</div>
			</div>
		)

		let resultsEls = _d.results.map((result, i)=>{
			let rankEl = <span>获取中，</span>
			if (result.complete) {
				if (result.rank === 0) {
					rankEl = <span>{"排名>"+ITEM_QUERY_NUM}</span>
				} else {
					rankEl = <span className="hasResult">{"排名"+result.rank}</span>
				}
			}
			return (
				<div className="resultRow" key={i}>
					{"• "}
					{rankEl}，
					{result.itemId}，
					{result.words.join("，")}
				</div>
			)
		})

		let resultView = (
			<div className="fullScreenView">
				<div className="result">
					{resultsEls}
				</div>
				<div className="bottomRow">
					<button onClick={this.back.bind(this)}>返回</button>
				</div>
			</div>
		)

		let view = _d.showResult ? resultView : requestView
		return (
			<div className="app">
				{view}
				<Alert stack={{limit: 3}} />
			</div>
		);
	}

	submit() {
		let str = _d.queryStr
		if (str === "") {
			return
		}

		_d.results = []

		let rows = str.split("\n")
		let errStr = ""
		rows.forEach((row, iRow)=>{
			let strs = row.split("，")
			if (strs.length < 2) {
				errStr = `第${iRow+1}个物品格式错误`
				return false
			}

			let itemId = 0
			let words = []
			strs.forEach((s, i)=>{
				if (i === 0) {
					itemId = parseInt(s, 10)
				} else {
					words.push(s)
				}
			})

			if (typeof(itemId) !== "number" || itemId === 0) {
				errStr = `第${iRow+1}个物品id错误`
				return false
			}

			if (words.length === 0) {
				errStr = `第${iRow+1}个物品缺少关键字:id=${itemId}`
				return false
			}

			let result = {
				itemId: itemId,
				words: words,
				complete: false,
				error: false,
				rank: 0,
			}
			_d.results.push(result)

			let strWord = encodeURI(words.join(" "))

			let url = "http://apiv4.yangkeduo.com/search?q="+strWord+"&page=1&size="+ITEM_QUERY_NUM+"&requery=0&sort=default&pdduid=0"
			let req = {
				url: url,
			}
			util.postApi("ajaxGet", req, (resp)=>{
					let data = JSON.parse(resp.data)
					console.log(data.items)
					result.complete = true

					let rank = 0
					data.items.forEach((item, i)=>{
						if (item.goods_id === itemId) {
							rank = i+1
							return false
						}
					})
					result.rank = rank

					this.forceUpdate()
			})
		})

		if (errStr !== "") {
			Alert.error(errStr, {position: 'top'})
			return
		}

		console.log(_d.results)

		//
		_d.showResult = true
		this.forceUpdate()
	}

	back() {
		_d.showResult = false
		this.forceUpdate()
	}

}

export default App;
