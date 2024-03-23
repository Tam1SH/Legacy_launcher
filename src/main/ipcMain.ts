import { app, BrowserWindow, dialog, ipcMain, Menu, protocol, shell, Tray, clipboard } from "electron"
import log from 'electron-log'
import path from 'path'
import { download, Progress } from "electron-dl"
import storage from 'electron-json-storage'
import { autoUpdater } from "electron-updater"
import { createWindow, getAssetPath, mainWindow } from "./main"
import fs from 'fs'
import registerHandlers from "./ipcMainHandles";
import MainLogic from "./MainLogic";

const Native = require('./natives.node')

class Updater {
	public updater : BrowserWindow | null = null
}

// eslint-disable-next-line import/prefer-default-export
export let updater = new Updater()

log.transports.file.level = "debug"
log.transports.file.file = path.join(Native.getEnv("PROGRAMDATA"), 'Sasavn/logs.txt')
autoUpdater.logger = log

const isDebug =
  	process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'


let tray : Tray | null = null


registerHandlers()

function getMainPath() {
	if(isDebug) 
		return __dirname
	else 
		return app.getPath('userData')
}



autoUpdater.on('update-available', (e) => {
	MainLogic.log('lol, available' + JSON.stringify(e))
})

autoUpdater.on('download-progress', (progress) => {
	MainLogic.log('lol, progress' + JSON.stringify(progress))
	if(updater && updater.updater) {
		
		updater.updater.webContents.send('download-progress', progress)
	}
})

autoUpdater.on('update-not-available', () => {
	MainLogic.log('lol, not-available')
	if(updater && updater.updater) {
		let env = MainLogic.getEnv()
		env.LauncherUpdated = true
		MainLogic.setEnv(env)
		createWindow()
		updater.updater.close()
	}
})

autoUpdater.on('update-downloaded', () => {
	if(updater && updater.updater) {
		let env = MainLogic.getEnv()
		env.LauncherUpdated = true
		MainLogic.setEnv(env)
		
		updater.updater.close()
		autoUpdater.quitAndInstall(true, true)
	}
})



ipcMain.handle('check-update', () => {
	log.info('check-update')
	autoUpdater.checkForUpdates()
})

ipcMain.handle('open-file-dialog', async (event, args) => { 
	try {
		console.log('open-file-dialog', args)
		let diagResult = await dialog.showOpenDialog({
			properties: ['openFile', 'multiSelections'],
			filters: [
				{ name: 'Images', extensions: args }
			] 
			})
		console.log(diagResult)
		return diagResult
	}
	catch(ex) {
		console.log(ex)
		return { message: ex }
	}

})


ipcMain.handle('min', () => {
	log.info('min')
	console.log('min')
	if(mainWindow)
		mainWindow.minimize()
	return 'ok'
})




ipcMain.handle('createReadStream', (_,args) => {
	return fs.createReadStream(args[0])
})


let inter: string | number | NodeJS.Timeout | undefined;
let isInjected = false;
let gtaIsOpen = false


ipcMain.handle('quit', () => {
	if(mainWindow)
		mainWindow.hide()
	return 'ok'
})




function checkExistsAndCreateIfIsnt(nameFolder : string) {
	if(!fs.existsSync(nameFolder)) {
		log.error(`not exists ${nameFolder}`)
		fs.mkdirSync(nameFolder)
	}
	else {
		log.debug(`already exists ${nameFolder}`)
	}
}


function downloadsAll(urls: string[], paths: string[], index : number) {
	if(urls.length < ++index) {
		try { 
			if(!fs.existsSync(paths[index])) {
				if(mainWindow) {

					download(BrowserWindow.getFocusedWindow()!, urls[index], {
						directory: path.dirname(paths[index])
			
					}).then(dl => {
						dl.setSavePath(paths[index])
						
						log.info(`${urls[index]} - downloaded at ${paths[index]}`)
						downloadsAll(urls, paths, index)
	
					}).catch(err => {
						log.info(`path: ${paths[index]} url: ${urls[index]} err: ${err}`)
					})
				}

			}
			else {
				log.info(`file exist ${paths[index]}`)
				downloadsAll(urls, paths, index)
			}
		}
		catch(e) {
			log.info(e)
		}
	}
	else {
		log.info('all files already downloaded')
	}
	
}

ipcMain.handle('createStructure', (e, args) => { 
	let sasavnFolder = path.join(Native.getEnv("PROGRAMDATA"), "Sasavn")
	args.folders.forEach((folder : string) => checkExistsAndCreateIfIsnt(path.join(sasavnFolder, folder)))
	let urls = args.files.map((file : string)=> path.join(`/files/defaultSasavnFiles/`,file))
	let paths = args.files.map((file: string) => path.join(sasavnFolder, file))
	downloadsAll(urls, paths, 0)
})

ipcMain.handle('setLang', (e, lang_) => {
	let stor = MainLogic.getStorage()
	stor.lang = lang_
	storage.set('launcherStorage', stor, () => {})
})

ipcMain.handle('getLang', () => {
	return MainLogic.getStorage().lang
})


app.whenReady().then(() => {
	protocol.registerFileProtocol('atom', (request, callback) => {
		console.log(request.url)
		const url = request.url.substr(7)
		callback({ path: url })
	})

	tray = new Tray(getAssetPath('./sasavn_icon.ico'))

	tray.on('click', () => {
		if(mainWindow)
			mainWindow.show()
	})

	const contextMenu = Menu.buildFromTemplate([
		{ label : "Выйти", click : () => { app.exit() } }
	])

	tray.setToolTip('Sasavn')
	tray.setContextMenu(contextMenu)
})
