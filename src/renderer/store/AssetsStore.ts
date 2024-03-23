/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable array-callback-return */


import { either, option, unfoldable } from "fp-ts"
import { pipe } from "fp-ts/lib/function"
import { Option } from "fp-ts/lib/Option"
import { makeAutoObservable } from "mobx"
import AssetInfo from "renderer/Info/AssetInfo"
import SasavnAPI from "renderer/Model/SasavnApi"
import ResponseError from "renderer/ReturnTypes/ResponseError"
import SasavnSocketAPI from '../Model/SasavnNotificationAPI'

class AssetsStore {

	Assets = new Array<AssetInfo>()

	currentAsset : AssetInfo | undefined

	private totalCount = 0

	totalLength() {
		return this.totalCount
	}

	length() {
		return this.Assets.length
	}


	reset() {
		this.Assets = []
		this.currentAsset = undefined
		this.totalCount = 0
	}

	async downloadAssets(count : number) {
		let 
		_ = await SasavnAPI.getAssets(this.getAssets().length, count)
		return _.match(
			(assets) => {
				console.log(1)
				console.log(`downloaded more assets with param: offset : ${this.getAssets().length}, count : ${count}`)
				console.log(assets)
				this.addAssets(assets)

				//this.Assets = []
			},
			(err : ResponseError) => {}
		)

	}

	async downloadAssetsAndReturnFirst(count : number) : Promise<Option<AssetInfo>> {

		let
		_ = await SasavnAPI.getAssets(this.getAssets().length, count)
		return _.match(
			(assets) => {
				console.log(2)
				console.log(`downloaded more assets with param: offset : ${this.getAssets().length}, count : ${count}`)

				console.log(assets)
				this.Assets = []
				return option.some(assets[0])
			},
			(err : ResponseError) => {return option.none}
		)
	}

	getAssetById(id : number) {

		let asset = this.Assets.filter(a => a !== null && a !== undefined).find(a => a.id === id)
		if(asset)
			return option.some(asset)
		else 
			return option.none
	}

	addAssets(assets : AssetInfo[]) {
		let set = new Set<string>()
		
		//сидеть ссылки сравнивать у объектов, весело наверно
		this.Assets.forEach(asset => set.add(JSON.stringify(asset)))
		assets.forEach(asset => set.add(JSON.stringify(asset)))

		console.log(set)
		this.Assets = Array.from(set).map(i => JSON.parse(i) as AssetInfo).filter(a => a !== null && a !== undefined)
		console.log(this.Assets)
	}

	getAssets() {
		return this.Assets.filter(a => a !== null && a !== undefined)
	}


	constructor() {
		
		makeAutoObservable(this)
		SasavnAPI.getAssetsCount()
			.then(result => result.match(
				count => {this.totalCount = count},
				() => {},
			))
	}

}

export default new AssetsStore()