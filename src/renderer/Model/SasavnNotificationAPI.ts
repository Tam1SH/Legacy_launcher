
import * as signalR from '@aspnet/signalr'
import SasavnAPI from './SasavnApi'
import LauncherAPI from './LauncherApi'

class SasavnSocketAPI {

	connection = new signalR.HubConnectionBuilder()
		.withUrl(`${SasavnAPI.server}/api/hub/workshop`,  {
			skipNegotiation: true,
			transport: signalR.HttpTransportType.WebSockets
		})
		.configureLogging(signalR.LogLevel.Debug)
		.build()
	
	TryStart = () => {
		this.connection.start()
			.catch((err) => {
				LauncherAPI.log('лол, произошла ошибка при подключении к сокету, ошибка? - ' + err)
				setTimeout(() => this.TryStart(), 5000)
			})
	}



	onDeletedAsset = (action : (id : number) => void) => {
		this.connection.on('RemovedAsset', action)
		return () => {this.connection.off('RemovedAsset', action)}
	}

	onChangedAsset = (action: (id: number) => void) => {

		this.connection.on('ChangedAsset', action)
		return () => {this.connection.off('ChangedAsset', action)}
	}

	constructor() {
		this.TryStart()
	}
}
export default new SasavnSocketAPI()