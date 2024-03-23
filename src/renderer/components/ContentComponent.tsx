import React, { PropsWithChildren } from "react"

type ContentComponentInfo = {
	image? : string, 
	description? : string,
	changeColor? : boolean
}

export default class ContentComponent extends React.Component<PropsWithChildren<ContentComponentInfo>> {
	render() {
		return(<div className ='AccountInfo'
		style ={{
			marginTop : '50px',
			display: 'flex',
			height : 'auto',
			minWidth : '250px',
			maxWidth : '700px',
			flexDirection : 'column',
			overflow : 'hidden',

		}}>
			<div style ={{
				height : '35px',
				width : '100%',
				display : 'flex',
				boxSizing : 'border-box',
			}}>
				{(() => {
					if(this.props.image) {
						let filter = ''
						if(this.props.changeColor)
							if(this.props.changeColor)
								filter = 'invert(51%) sepia(0%) saturate(0%) hue-rotate(196deg) brightness(97%) contrast(82%)'
						return <div style ={{
							display : 'flex',
							
						}}><img className='unselectable'  unselectable='on' style ={{
							width : '25px',
							height : '25px',
							marginLeft : '10px',
							marginTop : 'auto',
							marginRight : '-10px',
							marginBottom : 'auto',
							overflow : 'hidden',
							borderRadius : '50%',
							filter
						}} src={this.props.image}/>
						</div>
					}
				})()}
				{(() => {
					if(this.props.description) {
						return <label className='unselectable' unselectable='on' style ={{
							marginBottom : 'auto',
							marginTop : 'auto',
							paddingBottom : '1px',
							marginLeft : '20px',
							fontWeight : 'bold',
							fontSize : '17px',
							color : '#a9a9a9',
						}}>
							{this.props.description}
							</label>
					}
					return undefined;
				})()}
			</div>
			<div style ={{
				display : 'flex',
				flexDirection : 'row',
				padding : '20px',
			}}>
				{this.props.children}
			</div>
			
		</div>)
	}
}