import * as signalR from '@microsoft/signalr'
import LauncherAPI from "./LauncherApi"
import SasavnAPI from "./SasavnApi"

class SasavnSocketAPI {

	connection = new signalR.HubConnectionBuilder()
		.withUrl(`${SasavnAPI.server}/api/hub/launcher`,  {
			skipNegotiation: true,
			transport: signalR.HttpTransportType.WebSockets
		})
		.configureLogging(signalR.LogLevel.Debug)
		.build()
	
	

	Close = async () => {
		if(this.connection.state === signalR.HubConnectionState.Connected)
			await this.connection.stop()
	}

	TryStart = async () => {
		if(!(this.connection.state === signalR.HubConnectionState.Connected))
		 	await this.connection.start()
	}


	onWaitForLogin = (uuid : string, action : (accessToken : string, refreshToken : string, expiration : string) => void) => {
		this.connection.on('WaitForLogin', action)

		return ({
			invokeResult : this.connection.invoke('RegistrationUUID', uuid),
			disposer : () => {this.connection.off('WaitForLogin', action)}
			})

	}

	constructor() {
	}
}
export default new SasavnSocketAPI()