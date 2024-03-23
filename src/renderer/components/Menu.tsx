import React from "react"

function Menu(props : React.PropsWithChildren) {
	return (
		<div className='menu' style ={{
			height : 'calc(100% - 50px)',
			width : '50px',
			minWidth : '50px',
			display : 'flex',
			flexDirection : 'column',
			position : 'fixed',
			zIndex : 10,
		}}>
			{props.children}
		</div>
	)
}
export default React.memo(Menu)