/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import './custom.css'
import Body from './components/Body';
import ProfileLink, { LoginMenu } from './components/LoginMenu/LoginMenu';
import DefaultIcon from './Entity/DefaultIcon.jpg'
import gtaLego from './Entity/gtaLego.jpg'
import React, { useEffect, useState } from 'react';
import settings from './Entity/settings.png'
import workshop from './Entity/workshop.png'
import { Link } from 'react-router-dom';
import Menu from './components/Menu';
import HiddenableComponent from './components/HiddenableComponent';
import { autorun, reaction } from 'mobx';
import UserStore from './store/UserStore';
import NotIfNoLogin from './Model/NotificationsActions';
import Version  from './Version';
import ChangeLogs from './Entity/change_logs.png'
import Header from './components/Header/Header';
import GlobalState from './GlobalState';
import { observer } from 'mobx-react-lite';
import { useComponentWillMount } from './usefull';
import { randomUUID } from 'crypto';
import { v4 as uuidv4 } from 'uuid'

type IconInfo = {
	to : string
	src : string
	filter? : string
}

function CheatIcon(props : IconInfo) {
	return (
		<Link to={props.to}>
			<div  style={{
				overflow: 'hidden',
				borderRadius: '50%',
				width: `35px`,
				height: `35px`,
				marginLeft: 'auto',
				marginRight: 'auto',
				marginTop: '5px',
				marginBottom: '5px',
				cursor: 'pointer',
			}}>
				<img 
					src = {props.src}
					style ={{width : '100%', height : '100%', filter : `${props.filter ? props.filter : ''}`}} />
			</div>
		</Link>
	)
}

function UpperMenu(props : React.PropsWithChildren) {
	return (
		<div style ={{
			height : '50%',
		}}>
			{props.children}
		</div>
	)
}

function UnderMenu(props : React.PropsWithChildren) {
	return (
		<div style ={{
			height : '50%',
			alignItems : 'center',
			flexDirection : 'column',
			display : 'flex',
			justifyContent: 'end',
			padding : '5px',
		}}>
			{props.children}

		</div>
	)
}



const Main = observer((props: React.PropsWithChildren) => {
	
	const [version, setVersion] = useState(GlobalState.launcherVersion)

	const _ = useComponentWillMount(() => {
		reaction(() => GlobalState.launcherVersion, version => setVersion(version))
		
	})
	

	return(
		<>
		<div style ={{display :'none'}}>{UserStore.lang}</div>
		<Header/>
		<Body>
			<Version version={version}/>
			<Menu>
				<UpperMenu>
					<CheatIcon 
						src={gtaLego} 
						to='/'/>
				</UpperMenu>
				
				<UnderMenu>

					<CheatIcon
						src={ChangeLogs}
						to='/ChangeLogs'/>
						

					<CheatIcon
						src={settings}
						to='/Settings'/>

					<CheatIcon
						src={workshop}
						to='/Workshop'/>


					<ProfileHeader/>
				</UnderMenu>
			</Menu>
			
			<div style ={{display : 'flex', marginLeft : '50px', width : '100%'}}>
				{props.children}
			</div>

		</Body>
		</>

	)
})

export default Main

const ProfileHeader = () => {

	const [comp, setComp] = useState<HiddenableComponent | undefined>()
	const callback = (comp : HiddenableComponent) => {setComp(comp)}

	const setVisibility = (isShow : boolean) => {
		if(comp) {
			
			comp.isShow = isShow
		}
	}

	
	return (
		<div className = "ProfileHeader">
			<ProfileLink />
			<HiddenableComponent
				callback={callback}
				external="ProfileIcon" 
				nested="LoginMenu" 
				eventType="mousedown">
				<LoginMenu isAlternative = {false} setVisibility={setVisibility} />
			</HiddenableComponent>
		</div>
	)
}
