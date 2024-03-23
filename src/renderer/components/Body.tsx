import React from "react"

export default function Body(props : React.PropsWithChildren) {
	return(
		<div
		style={{
			display : 'flex',
			backgroundColor : '#1F1F1F',
			width : '100%',
			height : '100%',
			}}>
				<div className='layout-scrollbar ' style ={{
					marginTop : '50px',
					width : '100%',
					height : 'calc(100% - 50px)',
					display : 'flex',
					overflow : 'auto',
				}}>
					<div style ={{
					display : 'flex',
					flexDirection : 'row',
					width : '100%',
					height : '100%',
					}}>
						{props.children}
					</div>
				</div>
		</div>
	)
}