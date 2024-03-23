
import Result from "renderer/Result";
import Environment from "renderer/ReturnTypes/Environment";
import LauncherError from "renderer/ReturnTypes/LauncherError";
import { either } from "fp-ts";
import GlobalState from "renderer/GlobalState";
export type OpenDialogReturnValue = {
    canceled: boolean
    filePaths: string[]
    bookmarks?: string[]
}

class LauncherAPI {

	static async getSasavnFolderPath() : Promise<Result<string, LauncherError>> {
		
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('getSasavnFolderPath')
		})
	}

	static async log(message : string | any, any? : any) : Promise<Result<unknown, LauncherError>> {
		console.log(message)
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('log', [message, any])
		})
	}
	
	static async resetToken() {
		return this.getResult(async () => {
			return window.electron.ipcRenderer.invoke('resetToken')
		})
	}

	static async downloadAsset(relativePath : string, blob : Blob) : Promise<Result<unknown, LauncherError>> {
		return this.getResult(async () => {
			return window.electron.ipcRenderer.invoke('downloadAsset', relativePath, await blob.arrayBuffer())
		})
	}

	static async uploadFilesByPath(paths : string[], server : string) : Promise<Result<unknown, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('upload-files-by-paths', [...paths, server])
		})
	}

	static async downloadByPath(path : string) : Promise<Result<unknown, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('download-by-path', path)
		})
	}


	static async createReadStream(path : string) : Promise<Result<unknown, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('createReadStream', path)
		})
	}

	static async openFileDialog(extensions : string[]) : Promise<Result<OpenDialogReturnValue, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('open-file-dialog', ...extensions)
		})
	}

	static async writeInClipboard(text : string) : Promise<Result<void, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('writeInClipboard', text)
		})
	}
	
	static async showInExplorer(path : string) : Promise<Result<void, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('showInExplorer', path)
		})
	}

	static async RedirectToSite(url : string) : Promise<Result<void, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('redirect_to_site', url)
		})
	}

	static async getAutoInject() : Promise<Result<string, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('get-auto-inject')
		})
	}

	static async getAutoStart() : Promise<Result<boolean, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('get-auto-launch')
		})
	}

	static async setAutoInject(bool : boolean, appName : string) : Promise<Result<void, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('set-auto-inject', bool, appName)
		})
	}

	static async setAutoLaunch(bool : boolean) : Promise<Result<void, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('set-auto-launch', bool)
		})
	}

	static async setToken(token : string) : Promise<Result<void, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('setToken', token)
		})
	}

	static async getEnvironment() : Promise<Result<Environment, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('getENV')
		})
	}

	static async getLauncherVersion() : Promise<Result<string, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('getVersion')
		})
	}

	static async quit() : Promise<Result<void, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('quit')
		})
	}

	static async minimize() : Promise<Result<void, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('min')
		})
	}

	static async getLang() : Promise<Result<string, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('getLang')
		})
	}

	static async getToken() : Promise<Result<string, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('getToken')
		})
	}

	static async launchExe(path : string) : Promise<Result<void, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('launchExe', path)
		})
	}

	static async setVersionInjector(version : string) : Promise<Result<void, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('setVersionInjector', [version])
		})
	}

	static async getVersionInjector() : Promise<Result<string, LauncherError>> {
		return this.getResult(() => {
			return window.electron.ipcRenderer.invoke('getVersionInjector')
		})
	}

	static async downloadInjector(url : string, onStart : () => void) : Promise<Result<void, LauncherError>> {
		return this.getResult(() => {
			onStart()
			return window.electron.ipcRenderer.invoke('download-injector', url)
		})
	}

	static async checkInjectorExist() : Promise<Result<true, LauncherError>> {
		return this.getResult(() => {
			console.log('lol')
			return window.electron.ipcRenderer.invoke('check-injector')
		})
	}
	
	private static async getResult<T>(func : () => Promise<any>) : Promise<Result<T, LauncherError>>  {

		let result = await func()
		if(result.message) {
			return new Promise(
				(resolve) => {
					resolve(new Result(either.right(result)))
				}
			)
		}
		else {
			return new Promise(
				(resolve) => {
					resolve(new Result(either.left(result)))
				}
			)
		}
	}

}
export default LauncherAPI