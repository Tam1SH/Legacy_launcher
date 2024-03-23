/* eslint-disable react/no-unused-prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useLayoutEffect, useState } from "react"
import { Link, Redirect } from "react-router-dom"
import SasavnAPI from "../../Model/SasavnApi"
import ResponseError from "../../ReturnTypes/ResponseError";
import strings from "../../store/strings";
import UserStore from "renderer/store/UserStore"
import LauncherAPI from "renderer/Model/LauncherApi"
import DefaultIcon from '../../Entity/DefaultIcon.png'
import './LoginMenu.css'
import { observer } from "mobx-react-lite";
import { observable, reaction } from "mobx";
import NotificationsManager, { NotificationErrorState } from "../Notifications/NotificationsManager";
import { v4 as uuidv4 } from 'uuid'
import SasavnNotificationAPI from "renderer/Model/SasavnNotificationAPI";
import SasavnSocketLauncherAPI from "renderer/Model/SasavnSocketLauncherAPI";
import SasavnApiAuthenticate from "renderer/Model/SasavnApiAuthenticate";
import Cookies from "universal-cookie"

function LoginMenuBodyIfNotLogined() {

	const [error, setError] = useState<string>()

	const login = async () => {
		LauncherAPI.log('Попытка войти через сайт')
		let uuid = uuidv4()
		let URLQuery = new URLSearchParams(
			{
				action : 'login',
				uuid
			}
		)

		try {
			await SasavnSocketLauncherAPI.Close()
			await SasavnSocketLauncherAPI.TryStart()
		}
		catch {}

		let l = SasavnSocketLauncherAPI.onWaitForLogin(uuid, (accessToken, refreshToken, expiration) => {
			
			UserStore.setTokens({
				expiration, 
				refreshToken, 
				token : accessToken
			})
			let root = document.getElementById('root')!
			let event = new MouseEvent("closeSelf", {bubbles : true})
			root.dispatchEvent(event)
			l.disposer()
		})

		l.invokeResult
			.then(() => {
				setTimeout(() => l.disposer(), 1000 * 60 * 5)
				LauncherAPI.RedirectToSite(`${SasavnAPI.server}/link/?${URLQuery.toString()}`)
			})
			.catch((err) => {
				LauncherAPI.log('лол, произошла ошибка при отправки данных к сокету, ошибка? - ' + err)
				setError(strings['Не удалось подключиться к серверу'])
				setTimeout(() => setError(undefined), 4000)
			})

	}
	
	return (
		<>
			<div style ={{
				padding : '20px',
				display : 'flex',
			}}>
				<div style ={{
					display : "flex",
					flexDirection : 'column',
					marginTop : '20px',
					alignItems : 'center',
				}}>
					{error && <label style ={{color : 'brown'}}>{error}</label>}

					<a style={{textDecoration : 'underline', cursor : 'pointer'}}
					onClick={login}>
						{strings['Войти']}
					</a>
					<label style ={{

					}}>
						{strings['или']}
					</label>

					<a style={{textDecoration : 'underline', cursor : 'pointer'}} 
					onClick={() => LauncherAPI.RedirectToSite('https://new.sasavn.ru/Registration')}>
						{strings['Зарегистрироваться']}
					</a>
				</div>
			</div>
		</>
	)
}

type LoginMenuBodyIfLoginedProps = {
	setVisibility?: (isShow : boolean) => void
}
function LoginMenuBodyIfLogined(props : LoginMenuBodyIfLoginedProps) {

	return(<div style ={{
		display : 'flex',
		flexDirection : 'row',
		padding : '20px',
	}}>

		<div style ={{
			display : 'flex',
			flexDirection : 'column',
		}}>
			<label style= {{
				fontSize : '15px', 
				wordBreak :'break-all',
				marginBottom : '0px',
				fontWeight : 'bold'}}>
				{UserStore.user ? UserStore.user.login : "error"}
			</label>

			<label style= {{
				fontSize : '15px', 
				wordBreak :'break-all',
				marginBottom : '0px',
				color : 'gray' }}>
				{UserStore.user ? formatRole(UserStore.user.Role_legacy) : "error"}
			</label>


			<div>
				<a onClick={() => LauncherAPI.RedirectToSite('https://new.sasavn.ru/Profile')}
				style={{
					fontSize : '14px', 
					wordBreak :'break-all',
					cursor : 'pointer',
				}}>
					{strings.Актировать_ключ}
				</a>
			</div>

			<div onClick={async () => {
				
				let root = document.getElementById('root')!
				let event = new MouseEvent("closeSelf", {bubbles : true})
				root.dispatchEvent(event)
				
			}} 
				style={{marginTop : '20px'}}>
				<Link to='/' 
				style={{
					fontSize : '14px', 
					wordBreak :'break-all',
					cursor : 'pointer',
					textDecoration : 'auto',
				}}
				onClick={() => {

					const cock = new Cookies()

					SasavnApiAuthenticate.closeSession(cock.get('refreshToken'))

					cock.remove('refreshToken', { path : '/' })
					cock.remove('expiration', { path : '/' })
					UserStore.deleteUser();
					UserStore.deleteImage();

				}}
				>
					{strings.Выйти}
				</Link>
			</div>


		</div>
	</div>)
	

	function formatRole(role : string) {
		if(role === "0") {
			return 'Free'
		}
		if(role === "1") {
			return 'Default'
		}
		if(role === "2") {
			return 'VIP'
		}
		if(role === "3") {
			return 'Helper'
		}
		if(role === "4") {
			return 'Артём пидарас'
		}

	}
}

class LoginMenuProps { 
	setVisibility?: (isShow : boolean) => void

	isAlternative: boolean = false
}

export function LoginMenu(props : LoginMenuProps) { 

	return(
		<>
		{!props.isAlternative && <div className="login-menu" id = "LoginMenu">

			{UserStore.user && <LoginMenuBodyIfLogined setVisibility={props.setVisibility}/>}

			{!UserStore.user && <LoginMenuBodyIfNotLogined/>}
		</div>}
		</>
		
	)


}


const ProfileLink = observer(() => {

	return (
		<div className="ProfileIcon" id ="ProfileIcon"  style={{minWidth : '40px'}}>
			<img src={UserStore.getImage() ?? DefaultIcon}
				style ={{cursor : 'pointer', width : '100%', height : '100%'}}/>
			
		</div>
	)
})



export default ProfileLink