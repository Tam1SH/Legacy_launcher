import React, {PropsWithChildren} from "react"

export default function HeadElements(props : PropsWithChildren) {
	return(
		<div style = {{
			display : 'flex', 
			flexDirection : 'row-reverse',
			alignItems : 'center',
			paddingRight : '15px',
			height : '100%'
			}}>
		{props.children}
		</div>
	)
}