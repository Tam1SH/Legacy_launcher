/* eslint-disable class-methods-use-this */

import electron, { app, BrowserWindow } from 'electron'
import Environment from '../renderer/ReturnTypes/Environment'
import storage from 'electron-json-storage'
import log from 'electron-log'
import path from 'path'
import fs from 'fs'
import JSZip from 'jszip'
import { download, Progress } from 'electron-dl'

import find from 'find-process'
import process from 'process' 
const Native = require('./natives.node')

const SasavnFolder = path.join(process.env.ProgramData!, 'Sasavn')

type JsonStorage = {
	lang : string
	version : string
	token : string
	usedAutoInject : string
}

class MainLogic {




	getSasavnFolderPath() {
		return SasavnFolder
	}

	launchExe(exeName : string) {
		log.debug(`launch exe - ${exeName}`)
		log.debug(Native.launchExe(exeName))
	}

	getLauncherVersion() {
		log.info('get-ver ' + app.getVersion())

		return app.getVersion()
	}

	getProgramDataPath() {
		return Native.getEnv("PROGRAMDATA")
	}

	private listener :  NodeJS.Timeout | null = null

	private isInjected = false

	private gtaIsOpen = false

	setAutoInject({b , name} : {b : boolean, name : string}) {
		let stor = this.getStorage()
		stor.usedAutoInject = `${b}`
		storage.set('launcherStorage', stor, this.defaultErrorLogger)
		if(b) {
			
			this.listener = setInterval(() => {

				find('name', name, true)
					.then((proc) => {
						if(proc.length > 0) {
							if(!this.isInjected) {
								setTimeout(() => {
									log.info('injecting')
									this.launchExe(path.join(this.getSasavnFolderPath(), 'Sasavn Injector.exe'))
										
								}, 30000)
								this.isInjected = true
							}
							log.info('founded the process')
						}
						else {
							this.isInjected = false
						}

					})
					.catch(() => {
						this.isInjected = false
					})
			}, 30000)
		}
		else {
			clearInterval(this.listener!)
		}
		
		return 'ok'
	}

	getAutoInject() {
		try {
			let usedAutoInject = this.getStorage().usedAutoInject
			console.log(this.getStorage())
			if(!usedAutoInject)
				throw 'lol'
	
			log.debug(`getAutoInject - ${usedAutoInject}`)
			return usedAutoInject
		}
		catch(err) {
			log.debug(`cannot getAutoInject  err: ${err}`)
			return { message : err }
		}
	}

	getAutoLaunch() {
		return electron.app.getLoginItemSettings({
			path: electron.app.getPath("exe")
		}).openAtLogin
	}

	setAutoLaunch(b : boolean) {
		log.info('set-auto-launch ' + b)
		
		electron.app.setLoginItemSettings({
			openAsHidden : true,
			openAtLogin: b,
			path: electron.app.getPath("exe")
		});
	}

	findProcessAndInject(processName : string) {
		if(Native.ProcessIsFind(processName)) { }
	}
	
	redirectToSite(url : string) {
		require('electron').shell.openExternal(url)
	}

	createSasavnFolder() {
		let SasavnFolder = path.join(Native.getEnv("PROGRAMDATA"), 'Sasavn')

		if(!fs.existsSync(SasavnFolder)) {
			fs.mkdirSync(SasavnFolder)
		}

		storage.setDataPath(SasavnFolder)
		if(!fs.existsSync(path.join(SasavnFolder, "launcherStorage.json"))) {
			storage.set('launcherStorage', { lang : 'en' ,
											version : '1.0.0', 
											token : '',
											usedAutoInject : 'false'}, 
											this.defaultErrorLogger)
		}

	}

	getStorage() {
		let result = storage.getSync('launcherStorage') as JsonStorage
		return result
	}

	getMainPath() {
		if(this.env.isDebug) 
			return __dirname
		else 
			return app.getPath('userData')
	}

	log(args : string) {
		log.info(args)
	}


	async downloadAsset(blob : ArrayBuffer, name : string) {
		
		try {
			let zip = new JSZip()
			let result = await zip.loadAsync(blob)
			
			let path__ = path.join(Native.getEnv("PROGRAMDATA"), `Sasavn/WorkShop/${name}`)
			checkExistsAndCreateIfIsnt(path__)
	
			result.forEach(async (name, zip) => {
				
				let path_ = path.join(path__, name)
				console.log(path_)
				let ext = path.extname(path_)

				if(!(ext === ".jpg" || ext === ".jpeg" || ext === ".png"))
				{
					let array = await zip.async('uint8array')
					fs.appendFileSync(path_, array)
				}
				
			})
		}
		catch(ex) {
			return { code : -1, message : ex }
		}
	
		return 'ok'
	}

	getToken() {
		try {

			let {token} = this.getStorage()
			
			console.log(token)
			if(token)
				return token as string
			else 
				return { message : 'no token:('}
		}
		catch(ex) {
			return { message : 'no token:('}
		}
	}

	setToken(token : string) 
	{
		let stor = this.getStorage()
		stor.token = token
		storage.set('launcherStorage', stor, this.defaultErrorLogger)
	}

	async downloadByPath(path : string) {
		console.log('download-by-path', path)
		let result = await download(BrowserWindow.getFocusedWindow()!, path);
		console.log('download-by-path', result.getMimeType(), result.getTotalBytes())
		return 'ok' 
	}

	downloadInjector(url : string) {
		try {
			log.debug(`download-injector by url : ${url}`)
			
			if(fs.existsSync(path.join(SasavnFolder, 'Sasavn Injector.exe'))) {
				fs.unlinkSync(path.join(SasavnFolder, 'Sasavn Injector.exe'))
			}
			const prop = {
				directory : SasavnFolder,
				onProgress : (progress: Progress) => {
					log.debug(progress)
					let focused = BrowserWindow.getFocusedWindow()
					
					if(focused) 
						focused.webContents.send('injector-downloading', progress)
				}
				
			}
	
			download(BrowserWindow.getFocusedWindow()!, url, prop).then(dl => {
				
				let focused = BrowserWindow.getFocusedWindow()
				if(focused) 
					focused.webContents.send('injector-downloaded', dl.getSavePath())
			})
	
			return 'ok'
		}
		catch(ex) {
			return { message : ex }
		}
	
	}

	setVersionInjector(version : string) {
		let stor = this.getStorage()
		stor.version = version
		storage.set('launcherStorage', stor, this.defaultErrorLogger)
	}

	getVersionInjector() {
		try {
			let version = this.getStorage().version
			if(!version)
				throw 'lol'
	
			log.debug(`get injector version - ${version}`)
			return version
		}
		catch(err) {
			log.debug(`cannot get injector version  err: ${err}`)
			return { message : err }
		}
	}

	checkInjector() {
		log.debug(`check-injector, ${SasavnFolder}`)
	
		let onError = (err : unknown) => { 
			log.error('lol 4e')
			log.error(err)
			return { message : err }
		}
		try {
			fs.accessSync(SasavnFolder, fs.constants.F_OK)
		}
		catch(err) {

		}
		try {
			fs.accessSync(path.join(SasavnFolder, 'Sasavn Injector.exe'), fs.constants.F_OK)
		}
		catch(err) {
			log.error('cannot find injector')
			return onError(err)
		}
		return true
		
	}

	
	resetUserToken() {
		let stor = this.getStorage()
		stor.token = ''
		storage.set('launcherStorage', stor, this.defaultErrorLogger)
	}
	
	getEnv() { 
		return this.env
	}

	setEnv(env : Environment) {
		this.env = env
	}


	private defaultErrorLogger = (err : any) => { log.error(err) }

	private env : Environment = {
		serverPath : "",
		isDebug : process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true',
		LauncherUpdated : false
	}

}

function checkExistsAndCreateIfIsnt(nameFolder : string) {
	if(!fs.existsSync(nameFolder)) {
		log.error(`not exists ${nameFolder}`)
		fs.mkdirSync(nameFolder)
	}
	else {
		log.debug(`already exists ${nameFolder}`)
	}
}

export default new MainLogic()