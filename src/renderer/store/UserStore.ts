/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable promise/no-nesting */

import { makeAutoObservable } from "mobx"

import ResponseError from "../ReturnTypes/ResponseError"
import UserData from "../ReturnTypes/UserData"
import SasavnAPI from "../Model/SasavnApi"
import { parseJwt } from "../usefull"
import Cookies from "universal-cookie"
import SasavnApiAuthenticate from "../Model/SasavnApiAuthenticate"
import RefreshTokenResult from "../ReturnTypes/RefreshTokenResult"
import TokenResult from "../ReturnTypes/TokenResult"

class UserStore {

	lang : 'en' | 'ru' = 'en'

	user : UserData | null = null

	image : string | null = null

	userLoading : boolean | null = null

	imageLoading : boolean | null = null

	constructor() {
		makeAutoObservable(this)

		const cookies = new Cookies()
		if(cookies.get('refreshToken')) {
			this.userLoading = true
			this.imageLoading = true

			import('../Model/SasavnApiAuthenticate')
			.then(async SasavnApiAuthenticate => {
				SasavnApiAuthenticate.default.refreshToken()
				.then(result => result.match(
					(tokens) => {
						this.setRefreshedToken(tokens)
						this.userLoading = false
						
					},
					(err) => {
						this.imageLoading = false
						this.userLoading = false
					}
				))
			})


		}
			
	}

	setTokens(tokens : TokenResult) {
		this.setUser(parseJwt(tokens.token))
		const cookies = new Cookies()
		SasavnAPI.token = tokens.token
		cookies.set('accessToken', tokens.token, { path: '/' });
		cookies.set('refreshToken', tokens.refreshToken, { path: '/', maxAge : new Date(tokens.expiration).getTime() });
		cookies.set('expiration', tokens.expiration, { path: '/', maxAge : new Date(tokens.expiration).getTime() });	

		console.log('ladasdasd')
		SasavnAPI.getUserProfileImage(this.user?.login!)
		.then(result => result.match(
			(data) => {
				console.log('asdasdasdasdasdsdads')
				this.setImage(data)
				this.imageLoading = false
			},
			(err : ResponseError) => {
				console.error('failed load image', err)
				this.imageLoading = false
			}
		))

	}

	setRefreshedToken(tokens : RefreshTokenResult) {

		const cookies = new Cookies()
		SasavnAPI.token = tokens.accessToken
		cookies.set('accessToken', tokens.accessToken, { path: '/' });
		this.setUser(parseJwt(tokens.accessToken))
		
		SasavnAPI.getUserProfileImage(this.user?.login!)
		.then(result => result.match(
			(data) => {
				console.log('asdasdasdasdasdsdads')
				this.setImage(data)
				this.imageLoading = false
			},
			(err : ResponseError) => {
				console.error('failed load image', err)
				this.imageLoading = false
			}
		))
	}

	getLang() {
		return this.lang
	}
	
	setLang(lang : 'en' | 'ru') {
		this.lang = lang
	}

	deleteUser() {
		this.user = null
	}

	deleteImage() {
		this.image = null
	}

	setUser(user : UserData) {
		this.user = user
	}

	setImage(image : string) {
		this.image = image
	}

	getImage() {
		return this.image
	}

	getUser() {
		return this.user;
	}

	isAdmin() {
		return this.user?.Role_legacy === '4'
	}
	isFree() {
		return this.user?.Role_legacy === '0'
	}
}


export default new UserStore()