import React, {PropsWithChildren} from "react";

export default function ListGamesHeader(props : React.PropsWithChildren) {
	
	return(
		<div className='ListGamesHeader'>
			<label style = {{
				display : 'flex',
				marginTop : '5px',
				color : 'white',
				fontSize : '20px'
			}}>
			{props.children}
			</label>
		</div>
	)
}
