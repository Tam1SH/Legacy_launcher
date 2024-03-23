import LauncherAPI from "renderer/Model/LauncherApi"
import min from '../../Entity/sver.svg'

export default function Minimize() {
	return (
		<div>
			<img 
				src={min}
				onClick={() => {LauncherAPI.minimize()}}
				className='mininize'
				draggable="false"
				style={{
					width : '35px', 
					height :  '35px',
					marginTop : '14px', 
					marginRight : '5px'}}
				/>
		</div>
	)
}