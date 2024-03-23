import React, {PropsWithChildren} from "react"



function Head(props: PropsWithChildren)  { 

	return (
			<div className='Head' style={{background : 'transparent', zIndex : 10}}>
				{props.children}
			</div>
		)
}
export default React.memo(Head)