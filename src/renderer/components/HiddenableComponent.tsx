import React from "react";

export type HiddenableProps = {
	external : string,
	nested : string,
	eventType : string,
	callback? : (comp : HiddenableComponent) => void
	callback1? : (isShow : boolean) => void
}

export default class HiddenableComponent extends React.Component<React.PropsWithChildren<HiddenableProps>> {
	
	handle : EventListener

	closeSelf : () => void

	isShow : boolean = false

	constructor(props : HiddenableProps) {
		super(props)
		if(this.props.callback)
			this.props.callback(this)

		this.closeSelf = () => {
			this.isShow = false
			this.setState({})
		}
		this.handle = (event) => {
			
			const external = document.getElementById(props.external)
			const nested = document.getElementById(props.nested)
			
			if(external) {
				if(nested)  {
					this.isShow = external.contains(event.target as Node) || nested.contains(event.target as Node)
				}
				else 
					this.isShow = external.contains(event.target as Node)
				if(this.props.callback1)
					this.props.callback1(this.isShow)
				this.setState({})
			}
		}
	}

	componentDidMount() {
		document.addEventListener(this.props.eventType, this.handle)
		document.addEventListener('closeSelf', this.closeSelf)
	}
		
	
	componentWillUnmount() {
		document.removeEventListener(this.props.eventType, this.handle)
		document.removeEventListener('closeSelf', this.closeSelf)
	}
	
	render() {
		return (
			<>
			{this.isShow && this.props.children}
			</>
		)
	}
	
}
