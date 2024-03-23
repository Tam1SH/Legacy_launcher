
import { app, BrowserWindow, shell } from 'electron'
import MenuBuilder from './menu'
import { resolveHtmlPath } from './util'
import * as Electron from 'electron'
import fs from 'fs'
import path from 'path'
import storage from 'electron-json-storage'
import { updater } from './ipcMain'
import { autoUpdater } from "electron-updater"
import MainLogic from './MainLogic'
const Native = require('./natives.node')


const ipc = Electron.ipcRenderer
export let mainWindow: BrowserWindow | null = null


// ipcMain.on('ipc-example', async (event, arg) => {
//   const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
//   console.log(msgTemplate(arg));
//   event.reply('ipc-example', msgTemplate('pong'));
// });


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  	process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
	require('electron-debug')();
}

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS'];

	return installer
		.default(
			extensions.map((name) => installer[name]),
			forceDownload)
		.catch(console.log);
};




const RESOURCES_PATH = app.isPackaged
? path.join(process.resourcesPath, 'assets')
: path.join(__dirname, '../../assets');

export const getAssetPath = (...paths: string[]): string => {
	return path.join(RESOURCES_PATH, ...paths);
};

export const createWindow = async () => {
	if (isDebug) {
		await installExtensions();
		let env = MainLogic.getEnv()
		env.serverPath = "https://localhost:44397"
		MainLogic.setEnv(env)
		
	}
	else {
		let env = MainLogic.getEnv()
		env.serverPath = "https://new.sasavn.ru"
		MainLogic.setEnv(env)
	} 
	
	mainWindow = new BrowserWindow({
		title : 'Sasavn Launcher',
		show: false,
		frame : false, 
		resizable : isDebug,
		width: 600,
		height: 600,
		minWidth: 600,
		minHeight: 600,
		titleBarStyle: 'hidden',
		icon: getAssetPath('sasavn_icon.ico'),
		webPreferences: {
		  preload: app.isPackaged
			? path.join(__dirname, 'preload.js')
			: path.join(__dirname, '../../.erb/dll/preload.js'),
			//nodeIntegration: true,
			//contextIsolation: true,
			//webSecurity: false
		},
	});
	
	MainLogic.createSasavnFolder()
	mainWindow.loadURL(resolveHtmlPath('index.html'));

	//const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
	
	//mainWindow.loadURL(startURL);

	mainWindow.on('ready-to-show', () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		if (process.env.START_MINIMIZED) {
			mainWindow.minimize();
		} else {
			mainWindow.show();
		}
	});

	const menuBuilder = new MenuBuilder(mainWindow);
	menuBuilder.buildMenu();

	// Open urls in the user's browser
	mainWindow.webContents.setWindowOpenHandler((edata) => {
	  shell.openExternal(edata.url);
	  return { action: 'deny' };
	});
  
	
	// Remove this if your app does not use auto updates
	// eslint-disable-next-line
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
	
	let stor = MainLogic.getStorage()
	MainLogic.setAutoInject({ b : stor.usedAutoInject === 'true', name : 'GTA5.exe'})
	/*
	mainWindow.webContents.on("before-input-event", (event, input) => {
		if(isDebug)
			if(input.code == 'F12' && input.type == 'keyDown') {
				if(mainWindow!.webContents.isDevToolsOpened())
					mainWindow!.webContents.closeDevTools()
				else
					mainWindow!.webContents.openDevTools()
			}

	});
*/
	//AppUpdater();
}


const AppUpdater = () => {
	
	updater.updater = new BrowserWindow({
		title : 'Sasavn Launcher',
		icon : getAssetPath('sasavn_icon.ico'),
		width: 300,
		height: 350,
		resizable : false,
		show: false,
		frame : false, 
		titleBarStyle: 'hidden',
		webPreferences : {
			preload: app.isPackaged
			? path.join(__dirname, 'preload.js')
			: path.join(__dirname, '../../.erb/dll/preload.js'),
			//nodeIntegration: true,
			//contextIsolation: true
		}
	});

	updater.updater.loadURL(resolveHtmlPath('index.html'));
	//const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
	
	//updater.loadURL(startURL);


	updater.updater.once('ready-to-show', () => {
		if(updater.updater) {
			if(!isDebug) {
				updater.updater.show()
				autoUpdater.checkForUpdates()
			}
			else {
				let env = MainLogic.getEnv()
				env.LauncherUpdated = true
				MainLogic.setEnv(env)
				createWindow()
				updater.updater.close()
			}
		}
	})
	
	updater.updater.on('closed', () => {
		updater.updater = null;
	});

}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
	.whenReady()
	.then(() => {
		AppUpdater();
		app.on('activate', () => {
			if (mainWindow === null) AppUpdater();
		});
	})
	.catch(console.log);






const additionalData = { myKey: 'myValue' }
const gotTheLock = app.requestSingleInstanceLock(additionalData)

if (!gotTheLock) {
	app.quit()
} 
else {
	app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
	// Print out data received from the second instance.
		console.log(additionalData)

			// Someone tried to run a second instance, we should focus our window.
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore()
			mainWindow.focus()
		}
	})
}


// Create myWindow, load the rest of the app, etc...
