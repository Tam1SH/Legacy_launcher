/* eslint-disable promise/no-nesting */
/* eslint-disable no-async-promise-executor */

import * as Either from 'fp-ts/Either'
import JSZip from "jszip"
import AssetInfo, { Content, PresentImages } from '../Info/AssetInfo'
import Result from '../Result';
import ChangeLog from '../ReturnTypes/ChangeLog';
import UserData from '../ReturnTypes/UserData';
import ResponseError from '../ReturnTypes/ResponseError';
import UserStore from '../store/UserStore';

type DefaultFetchOptions<T> = {
	resolve: (value: Result<T, ResponseError>) => void, 
	response : RequestInfo | URL, 
	typeResponse? : 'POST' | 'GET' | 'DELETE', 
	body? : BodyInit, 
	typeResult? : 'json' | 'blob' | 'string'
}


export default class SasavnAPI {

	static fetch<T>(options : DefaultFetchOptions<T>) { 
		return this.DefaultFetch(options.resolve, options.response, options.typeResponse, options.body, options.typeResult)
	}


	//static server: string  = "https://localhost:44397"
	static server: string  = "https://sasavn.ru"

	static token: string;
	//CHANGE_ROLE_AND_PASS

	static async installAsset(id : number) : Promise<Result<Blob, ResponseError>> {
		return this.Try((resolve) => {
			this.DefaultFetch(resolve, `/api/assets/installAsset/${id}`, 'GET', undefined, 'blob')
		})
	}

	static async getAssetsCount() : Promise<Result<number, ResponseError>> {
		return this.Try((resolve) => {
			this.DefaultFetch(resolve, `/api/assets/getAssetsCount`)
		})
	}	

	static async getAssetById(id : number) : Promise<Result<AssetInfo, ResponseError>> {
		return this.Try((resolve) => {
			this.DefaultFetch(resolve,  `/api/assets/getAssetById/${id}`, "GET")
		})
	}

	static async getAssets(startIndex : number, count : number) : Promise<Result<Array<AssetInfo>, ResponseError>> {
		return this.Try((resolve) => {
			this.DefaultFetch(resolve,  `/api/assets/getAssets/${startIndex}/${count}`)
		})
	}

	static async editAsset(
		id : number,
		author : string, 
		name : string, 
		description : string, 
		addedPictures : File[], 
		savedPictures : PresentImages[] | undefined, 
		addedContent : File[], 
		savedContents : Content[] | undefined): Promise<Result<unknown, ResponseError>> {
		return this.Try((resolve) => {

			const formData = new FormData()
			formData.append('id', id.toString())
			formData.append('author', author)
			formData.append('name', name) 
			formData.append('description', description)

			if(savedPictures)
				formData.append('savedPictures', JSON.stringify(savedPictures))
			if(savedContents)
				formData.append('savedContents', JSON.stringify(savedContents))

			const zip = new JSZip();
			addedPictures.forEach((picture, i) => zip.file(picture.path, picture))
			addedContent.forEach((content, i) => zip.file(content.path, content))

			if(addedPictures.length === 0 && addedContent.length === 0) {
				this.DefaultFetch(resolve, `/api/assets/editAsset/`, "POST", formData)
			}
			else {
				zip.generateAsync({type : 'blob'}).then(async content => {
					formData.append('nameLOL', content)
					this.DefaultFetch(resolve, `/api/assets/editAsset/`, "POST", formData)
				})
			}
		})
	}


	static async createAsset(author : string, name : string, description : string, pictures : File[], contents : File[]) : Promise<Result<unknown, ResponseError>> {
		return new Promise (
			(resolve, reject) => {
				
				const zip = new JSZip();
				pictures.forEach((picture, i) => zip.file(picture.path, picture))
				contents.forEach((content, i) => zip.file(content.path, content))
				
				zip.generateAsync({type : 'blob'}).then(async content => {
					const formData = new FormData();
					formData.append('nameLOL', content)
					formData.append('author', author)
					formData.append('name', name) 
					formData.append('description', description)
					console.log('createAsset', formData)

					this.DefaultFetch(resolve, `/api/assets/createAsset/`, "POST", formData)
				})
			}
		)
	}

	static async deleteAsset(id : number)  {

		return this.Try((resolve) => {
			this.DefaultFetch(resolve, `/api/assets/deleteAsset/${id}`, 'DELETE')
		})
	}

	static async incAssetViewCount(id : number)  {
		return this.Try((resolve) => {
			this.DefaultFetch(resolve, `/api/assets/viewInc/${id}`)
		})
	}

	static async getCurrentVersionInjector() : Promise<Result<{version : string}, ResponseError>> {
		return this.Try((resolve) => {
			this.DefaultFetch(resolve, `/api/cheat/getCurrentVersionInjector`)
		})
	}


	static async changeLauncherVersion(newVersion : string) {
		return this.Try((resolve) => {
				this.DefaultFetch(resolve, `/api/users/changeLauncherVersion/${newVersion}`)
		})
	}

	static async changeCheatVersion(newVersion : string) {
		return this.Try((resolve) => {
				this.DefaultFetch(resolve, `/api/users/changeCheatVersion/${newVersion}`)
		})
	}

	static async changeRoleAndPass(id : number, role : number, pass? : string) {
		return this.Try((resolve) => {
			if(pass)
				this.DefaultFetch(resolve, `/api/users/changeRoleAndPass/${id}/${role}/${pass}`)
			else 
				this.DefaultFetch(resolve, `/api/users/changeRoleAndPass/${id}/${role}`)
		})
	}


	static async deleteChangelog(version : string) {
		return this.Try((resolve) => {
			this.DefaultFetch(resolve, `/api/changelogs/deleteChangelog/${version}`)
		})
	}

	static async changeExistUpdate(version : string, date : string, changelogs : string) {
		return this.Try((resolve) => {
			
			const formData = new FormData();
			formData.append('version', version)
			formData.append('date', date)
			formData.append('changelogs', changelogs)
			
			this.DefaultFetch(resolve, `/api/changelogs/changeExistUpdate`, 'POST', formData, 'json')
		})
	}

	static async uploadUpdate(version : string, date : string, changelogs : string, publish : boolean, changeInDatabase : boolean) {
		return this.Try((resolve) => {
			
			const formData = new FormData();
			formData.append('version', version)
			formData.append('date', date)
			formData.append('changelogs', changelogs)
			formData.append('publish', `${publish}`)
			formData.append('changeInDatabase', `${changeInDatabase}`)
			this.DefaultFetch(resolve, `/api/changelogs/uploadUpdate`, 'POST', formData, 'json')
		})
	}

	static async activateKey(token : string, key : string) : Promise<Result<string, ResponseError>> {

		return this.Try((resolve) => {
			
			let json = JSON.stringify({
				token,
				key
			})

			this.DefaultFetch(resolve, `/api/users/ActivateKey`, 'POST', json)
		})
	}


	static async uploadProfileImage(token : string, blob : Blob) : Promise<Result<string, ResponseError>> {

		return this.Try((resolve) => {
			const formData = new FormData();
			formData.append('image', blob)

			this.DefaultFetch(resolve, `/api/users/LoadProfileImage/${token}`, 'POST', formData)
		})
	}

	static async getKeysForReseller(keyType : number) : Promise<Result<string[], ResponseError>> {
		//Default - 1
        //HWID - 4 
		return this.Try((resolve) => {
			this.DefaultFetch(resolve, `/api/resellers/getKeysForReseller/${keyType}`)
		})
	}

	static async getUserProfileImage(name : string) : Promise<Result<string, ResponseError>> {
		return this.Try((resolve) => {
			this.DefaultFetch(resolve, `/api/users/getUserProfileImage/${name}`)
		})
	}

	static async GetProfileImage() : Promise<Result<Blob, ResponseError>> {
		return this.Try((resolve) => {
			this.DefaultFetch(resolve, '/api/users/GetProfileImage', 'GET', undefined, 'blob')
		})
	}

	static async getChangeLogsCount() : Promise<Result<number, ResponseError>> {
		return this.Try((resolve) => {
			this.DefaultFetch(resolve, `/api/changelogs/getChangeLogsCount`)
		})
	}


	static async getChangeLogs(offset : number, count : number) : Promise<Result<ChangeLog[], ResponseError>> {
		return this.Try((resolve) => {
			this.DefaultFetch(resolve, `/api/changelogs/GetChangeLogs/${offset}/${count}`)
		})
	}
	
	
	static async Auth(login : string, password : string) : Promise<Result<{token : string}, ResponseError>> {

		return this.Try((resolve) => {
			this.DefaultFetch(resolve, `/api/users/Token/${login}/${password}`)
		})
	}

	
	static async registerUser(login : string, password : string, email : string, response : string) : Promise<Result<string, ResponseError>> {

		return this.Try((resolve) => {
			let body = JSON.stringify({
				login,
				password,
				email,
				secret : response
			})
			this.DefaultFetch(resolve, `/api/users/RegisterUser`, 'POST', body)
		})
	}


	private static Try<T>(func : (resolve: (value: Result<T, ResponseError>) => void) => void) : Promise<Result<T, ResponseError>> {
		try {
			return new Promise<Result<T, ResponseError>> (
				(resolve, reject) => func(resolve)
			)
		}
		catch {
			let value = { code : -1, message : 'Internal error'}
			return new Promise<Result<T, ResponseError>> (
				(resolve, reject) => {
					resolve(new Result(Either.right(value as any)))
				}
			)
		}
	}

	private static DefaultFetch<T>(resolve: (value: Result<T, ResponseError>) => void, response : RequestInfo | URL, typeResponse? : 'POST' | 'GET' | 'DELETE', body? : BodyInit, typeResult? : 'json' | 'blob' | 'string') {
		
		console.debug(response)
		fetch(`${SasavnAPI.server}${response}` as RequestInfo, {
			headers : {
				Authorization : `Bearer ${SasavnAPI.token}` 
			},
			body : body || undefined,
			method : typeResponse || 'GET'
		})
		.then(async response => {
			
			if(response.status === 401) {
				try {
					console.debug('refreshing token')
					import('./SasavnApiAuthenticate')
						.then(async SasavnApiAuthenticate => {
							const tokens = (await SasavnApiAuthenticate.default.refreshToken()).resultWithThrow()
							UserStore.setRefreshedToken(tokens)
						})
						
				}
				catch {}
			}

			if(response.ok) {
				console.debug('ok')
				if(typeResult === 'blob')
					resolve(new Result(Either.left(await response.blob() as any)))
				if(typeResult === 'json')
					resolve(new Result(Either.left(await response.json())))

				if(typeResult === 'string')
					resolve(new Result(Either.left(await response.text() as T)))
				
				let result = await response.json()
				console.debug(result)
				resolve(new Result(Either.left(result)))
			}
			else {
				console.debug('bad')

				try {
					let result = await response.json()
					console.debug(result)
					resolve(new Result(
						Either.right(
							new ResponseError(result.message ?? 'Unknown', result.code ?? -1)
							)
						))
				}
				catch {
					console.debug(response)
					resolve(new Result(
						Either.right(
							new ResponseError('Unknown', -1)
							)
						))
				}
				
				let result = await response.json()
				console.debug(result)
				resolve(new Result(
					Either.right(
						new ResponseError(result.message ?? 'Unknown', result.code ?? -1)
						)
					))
			}
		})
		.catch(async (err) => {

			resolve(new Result(
				Either.right(
					new ResponseError(err.message ?? 'Unknown', err.code ?? -1)
					)
			))
		})
	}
}