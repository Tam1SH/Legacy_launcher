
import { ipcMain } from "electron"
import { Channels } from "./preload"
import MainLogic from "./MainLogic"

function handle<T>(channel : Channels, listener : (event : Electron.IpcMainInvokeEvent, ...args : any[]) => T) {
	ipcMain.handle(channel, (e, args) => {
		try {
			let result = listener(e, args)
			if(result === undefined) {
				return 'ok'
			}
			return result
		}
		catch(ex) {
			let msg = {code : -1, message : ex}
			MainLogic.log(JSON.stringify(msg))
			return msg
		}
	})
}

export default function registerHandlers() {

	handle('set-auto-inject', (e, args) => {
		console.log(`ALO NAXYU `, args)
		let b = args[0] as boolean
		let name = args[1] as string
		return MainLogic.setAutoInject({b, name})
	})

	handle('get-auto-inject', () => MainLogic.getAutoInject())

	handle('get-auto-launch', () => MainLogic.getAutoLaunch())
	
	handle('log', (e, args) => MainLogic.log(JSON.stringify(args)))

	handle('getENV', () => MainLogic.getEnv())

	handle('resetToken', () => MainLogic.resetUserToken())

	handle('check-injector', () => MainLogic.checkInjector())

	handle('downloadAsset', (e, args) => {
		let blob = args[1] as ArrayBuffer
		let name = args[0] as string
		return MainLogic.downloadAsset(blob, name)
	})

	handle('setToken', (e, args) => {
		let token : string = args[0]
		return MainLogic.setToken(token)
	})

	handle('getToken', () => MainLogic.getToken())

	handle('getVersionInjector', () => MainLogic.getVersionInjector())

	handle('download-by-path', (e, args) => {
		let path = args[0]
		return MainLogic.downloadByPath(path)
	})

	handle('getSasavnFolderPath', () => MainLogic.getSasavnFolderPath())

	handle('download-injector', (e, args) => {
		let url : string = args[0]
		return MainLogic.downloadInjector(url)
	})

	handle('setVersionInjector', (e, args) => {
		let version = args[0]
		return MainLogic.setVersionInjector(version)
	})

	handle('isLoaded', () => {
		return MainLogic.getEnv().LauncherUpdated
	})
	
	handle('findProcessAndInject', (e, args) => {
		let processName : string = args[0]
		return MainLogic.findProcessAndInject(processName)
	})
	
	handle('redirect_to_site', (e, args) => {
		let url = args[0] as string	
		return MainLogic.redirectToSite(url)
	})

	handle('set-auto-launch', (e, args) => {
		let b = args[0] as boolean 
		return MainLogic.setAutoLaunch(b)
	})

	
	handle('launchExe', (e, args) => {
		let nameExe : string = args[0]
		return MainLogic.launchExe(nameExe)
	})

	handle('getVersion', () => MainLogic.getLauncherVersion())
	//handle('getPath', MainLogic.getProgramDataPath)


}
