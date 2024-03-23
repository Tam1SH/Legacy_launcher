/* eslint-disable class-methods-use-this */
import React, { useEffect, useState } from "react";
import SasavnIcon from '../Entity/SasavnIcon.png'
import LauncherAPI from "renderer/Model/LauncherApi";

type Type = {
	total: number;
    delta: number;
    transferred: number;
    percent: number;
    bytesPerSecond: number;

}
export default function Updater() {
	
	const [lol, setLol] = useState<Type>()
	useEffect(() => {
		window.electron.ipcRenderer.on('download-progress', (args) => {
			let res = args as Type
			setLol(res)
		})
		
	})

	return(
		<div className = 'updater' style ={{
			display : 'flex',
			width  :'100%',
			height  : '100%',
			flexDirection : 'column',
		}}>

			<div className='update' style ={{
				marginLeft : 'auto',
				marginRight : 'auto',
				marginTop : '120px',
				width : '60px',
				height : '60px',
				marginBottom : '70px',
				
			}}>
				<img src ={SasavnIcon} style ={{width : '100%', height : '100%'}} />
			</div>

			<div style ={{
				display : 'flex',
				margin : 'auto',
			}}>
				<div id="progress" style ={{
					background : `linear-gradient(to right, white ${lol?.percent}%, grey ${0}%)`,
					width : '180px',
					height : '2px',
					visibility : lol ? 'visible' : 'hidden'
				}} />
			</div>
		</div>
	)
}
