import React from "react"
import logo from '../Entity/SasavnIcon.png'


export default function Icon() { 
	return(
		<div className = 'unselectable' 
			 style = {{verticalAlign: 'middle', marginRight : 'auto'}}> 

			<div style = {{display : 'flex', width : '100%', height : '100%'}}>
				<div style = {{width : "50px", height : "50px"}}>
					<img className = 'unselectable'  
						src={logo} 
						style={{height : "100%", width : '100%'}}/>
				</div>
			</div>
		</div>
	)
}