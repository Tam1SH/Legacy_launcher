import LauncherAPI from "renderer/Model/LauncherApi"
import close from '../../Entity/close.svg'

export default function Close() {
	return(
		<div>
			<img 
				src={close}
				className ='close'
				draggable="false"
				onClick={() => {LauncherAPI.quit()}}
			/>
		</div>
	)
}