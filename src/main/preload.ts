import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example' 
					 | 'quit' 
					 | 'min' 
					 | 'set-auto-inject' 
					 | 'get-auto-inject'
					 | 'set-auto-launch' 
					 | 'get-auto-launch'
					 | 'getToken'
					 | 'createStructure'
					 | 'download-injector'
					 | 'setVersionInjector'
					 | 'launchExe'
					 | 'check-injector'
					 | 'getVersionInjector'
					 | 'redirect_to_site'
					 | 'setToken'
					 | 'setLang'
					 | 'getLang'
					 | 'progress'
					 | 'isLoaded'
					 | 'getVersion'
					 | 'getENV'
					 | 'injector-downloaded'
					 | 'injector-downloading'
					 | 'showInExplorer'
					 | 'writeInClipboard'
					 | 'open-file-dialog'
					 | 'createReadStream'
					 | 'download-by-path'
					 | 'upload-files-by-paths'
					 | 'downloadAsset'
					 | 'log'
					 | 'resetToken'
					 | 'findProcessAndInject'
					 | 'download-progress'
					 | 'getSasavnFolderPath'
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
		addListener(channel: Channels, func: (...args: unknown[]) => void): void {
			ipcRenderer.addListener(channel, func)	
		},
		invoke(channel: Channels, ...args: unknown[]): Promise<unknown> {
			return ipcRenderer.invoke(channel, args)
		},
		sendMessage(channel: Channels, args: unknown[]) {
			ipcRenderer.send(channel, args);
		},
		on(channel: Channels, func: (...args: unknown[]) => void) {
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
				func(...args);
			ipcRenderer.on(channel, subscription);

			return () => {
				ipcRenderer.removeListener(channel, subscription);
			};
		},
		once(channel: Channels, func: (...args: unknown[]) => void) {
			ipcRenderer.once(channel, (_event, ...args) => func(...args));
		}
	}

});

