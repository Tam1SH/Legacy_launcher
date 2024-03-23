

import NotificationsManager, { NotificationConstantState, NotificationDialogState, NotificationErrorState, NotificationState, NotificationStaticState, NotificationSuccessState } from "./NotificationsManager"
import { NotifactionOnProgressState as NotificationOnProgressState, ProgressListener } from "./NotifactionOnProgress/NotifactionOnProgressState"
import { useEffect, useState } from "react"
import close from '../../Entity/close.svg'

type NotificationProps = {
	state : NotificationState
	index : number
	id : string
}



type CloseButtonProps = {
	id : string
	action? : () => void
}

function CloseButton(props : CloseButtonProps) {
	return 	<div style ={{
		position : "absolute",
		left : 'calc(100% - 25px)',
		top : '10px',
		width : '15px',
		height : '15px',
		cursor : 'pointer',
	}}
	onClick={() => {
		if(props.action)
			props.action()

		NotificationsManager.removeNotById(props.id)
		}}>
		<img src={close} style ={{filter: 'invert(99%) sepia(92%) saturate(3%) hue-rotate(198deg) brightness(107%) contrast(100%)'}} />
	</div>
}

type NotificationErrorProps = {
	state : NotificationErrorState
	id : string
}

function NotificationError(props : NotificationErrorProps) {
	return (
		<div className="shadow Notification" style ={{
			background: 'rgba(165, 42, 42, 0.7)',
			backdropFilter: 'blur(10px)',
			width : '300px',
			marginLeft : '-150px',
			padding : '15px',
			borderRadius : '5px',
			marginTop : '10px',
			border : '1px solid #e70000'
		}}>
			<CloseButton id={props.id}/>

			<div style ={{
				display : 'flex',
				flexDirection : 'column',
			}}>
				<label style ={{
					fontSize : '20px',
					fontWeight : 'bold',
					marginBottom : '0px'
				}}>
					{props.state.title}
				</label>
				<label style ={{
					marginBottom : '0px'
				}}>
					{props.state.description}
				</label>
			</div>

		</div>
	)
}

type StaticNotificationProps = {
	state : NotificationStaticState
}

function StaticNotification(props : StaticNotificationProps) {
	return (
		<div className="shadow Notification" style ={{
			background: '#323232',
			width : '300px',
			marginLeft : '-150px',
			padding : '15px',
			borderRadius : '5px',
			marginTop : '10px',
			border : '1px solid #5a5a5a',
		}}>

			<div style ={{
				display : 'flex',
				flexDirection : 'column',
			}}>
				<label style ={{
					fontSize : '20px',
					fontWeight : 'bold',
					marginBottom : '0px',
					wordBreak :'break-word'
				}}>
					{props.state.title}
				</label>
				<label style ={{
					marginBottom : '0px',
					wordBreak :'break-word'
				}}>
					{props.state.description}
				</label>
			</div>

		</div>
	)
}


function NotificationProgress(state : NotificationOnProgressState) {

	const listener : ProgressListener = (currentProgress) => setProgress(currentProgress)
	const [currentProgress, setProgress] = useState(0)

	useEffect(() => {
		state.observer.addListener(listener)
		setProgress(state.observer.getCurrentProgress())
		return () => state.observer.removeListener(listener)
	}, [state.observer])

	return (
		<div className="shadow Notification" style ={{
			background: '#323232',
			width : '300px',
			marginLeft : '-150px',
			padding : '15px',
			borderRadius : '5px',
			marginTop : '10px',
			border : '1px solid #5a5a5a',
		}}>
			<div style ={{
				display : 'flex',
				flexDirection : 'column',
				marginTop : '5px'
			}}>
				<label style ={{
					fontSize : '20px',
					fontWeight : 'bold',
					marginBottom : '0px',
					wordBreak :'break-word'
				}}>
					{state.title}
				</label>
				<label style ={{
					marginBottom : '5px',
					wordBreak :'break-word'
				}}>
					{state.description}
				</label>
				<div id="progress" style ={{
						background : `linear-gradient(to right, white ${currentProgress}%, grey ${0}%)`,
						width : '180px',
						height : '2px',
				}} />
			</div>

		</div>
	)
}

type NotificationSuccessProps = {
	state : NotificationConstantState
	id : string
}

function NotificationSuccess(props : NotificationSuccessProps) {
	return (
		<div className="shadow Notification" style ={{
			background: 'rgba(0,123,22, 0.7)',
			backdropFilter: 'blur(10px)',
			width : '300px',
			marginLeft : '-150px',
			padding : '15px',
			borderRadius : '5px',
			marginTop : '10px',
			border : '1px solid #00f900'
		}}>
			<CloseButton id={props.id}/>

			<div style ={{
				display : 'flex',
				flexDirection : 'column',
			}}>
				<label style ={{
					fontSize : '20px',
					fontWeight : 'bold',
					marginBottom : '0px'
				}}>
					{props.state.title}
				</label>
				<label style ={{
					marginBottom : '0px'
				}}>
					{props.state.description}
				</label>
			</div>

		</div>
	)
}

type NotificationConstantProps = {
	state : NotificationConstantState
	id : string

}

function Notification(props : NotificationConstantProps) {
	return (
		<div className="shadow Notification" style ={{
			background: 'rgba(50, 50, 50, 0.7)',
			backdropFilter: 'blur(10px)',
			width : '300px',
			marginLeft : '-150px',
			padding : '15px',
			borderRadius : '5px',
			marginTop : '10px',
			border : '1px solid #5a5a5a',
		}}>
			<CloseButton id={props.id}/>

			<div style ={{
				display : 'flex',
				flexDirection : 'column',
			}}>
				<label style ={{
					fontSize : '20px',
					fontWeight : 'bold',
					marginBottom : '0px'
				}}>
					{props.state.title}
				</label>
				<label style ={{
					marginBottom : '0px'
				}}>
					{props.state.description}
				</label>
			</div>

		</div>
	)
}

type NotificationDialogProps = {
	state : NotificationDialogState
	id : string
}

function NotificationDialog(props : NotificationDialogProps) {
	return (
		<div className="shadow Notification" style ={{
			background: 'rgba(50, 50, 50, 0.7)',
			backdropFilter: 'blur(10px)',
			width : '300px',
			marginLeft : '-150px',
			padding : '15px',
			borderRadius : '5px',
			marginTop : '10px',
			border : '1px solid #5a5a5a',
		}}>
			<CloseButton id={props.id} action={props.state.onRight}/>

			<div style ={{
				display : 'flex',
				flexDirection : 'column',
			}}>
				<label style ={{
					fontSize : '20px',
					fontWeight : 'bold',
					marginBottom : '0px'
				}}>
					{props.state.title}
				</label>
				<label style ={{
					marginBottom : '0px'
				}}>
					{props.state.description}
				</label>
				<div style ={{
					display : 'flex',
					flexDirection : 'row',
					margin : 'auto',
					marginTop : '10px',
				}}>
				<button className='inject-button' style ={{
					height : "30px",
					fontSize : '17px',
					letterSpacing : '1px',
					marginRight : '30px',
				}}
				onClick={() => {
					if(props.state.onLeft)
						props.state.onLeft()
					
					NotificationsManager.removeNotById(props.id)
				}}>
					Да
				</button>
				<button className='inject-button' style ={{
					height : "30px",
					fontSize : '17px',
					letterSpacing : '1px',
				}}
				onClick={() => {
					if(props.state.onRight)
						props.state.onRight()
					NotificationsManager.removeNotById(props.id)
				}}>
					Отмена
				</button>
				</div>
			</div>

		</div>
	)
}


export default function NotificationComponent(props : NotificationProps) {
	function component(c : NotificationState) {

		if(c instanceof NotificationErrorState) {
			return <NotificationError {...c} {...props}/>
		}

		if(c instanceof NotificationConstantState) {
			return <Notification {...c} {...props}/>
		}
		if(c instanceof NotificationStaticState) {
			return <StaticNotification {...c} {...props}/>
		}
		if(c instanceof NotificationOnProgressState) {
			return <NotificationProgress {...c} {...props}/>
		}
		if(c instanceof NotificationSuccessState) {
			return <NotificationSuccess {...c} {...props}/>
		}
		
		if(c instanceof NotificationDialogState) {
			return <NotificationDialog state={c} id={props.id}/>
		}
	}
	
	return (
		<>{component(props.state)}</>
	)
}