/* eslint-disable jsx-a11y/no-autofocus */
import React, { useEffect, useState } from "react";
import Main from '../Main'
import ProfileComponent from "./ContentComponent"
import settings from '../Entity/settings.svg'
import strings from "renderer/store/strings";
import UserStore from "renderer/store/UserStore";
import LauncherAPI from "renderer/Model/LauncherApi";
import znakVoprosa from 'renderer/Entity/znak_voprosa.png'
import NotificationsManager, { NotificationConstantState, NotificationErrorState } from "./Notifications/NotificationsManager";
import GlobalState from "renderer/GlobalState";
import { observer } from "mobx-react-lite";
import Button from "./Button/Button";
import { useComponentWillMount } from "renderer/usefull";


const Settings = observer(() => {
	
	const [autoLaunch, setAutoLaunch] = useState(false)
	const [autoInject, setAutoInject] = useState(false)

	const _ = useComponentWillMount(() => {
		LauncherAPI.getAutoStart()
		.then(
			_ => _.match((b) => {
				setAutoLaunch(b)
				let el = document.getElementsByName('toggle1')[1] as HTMLInputElement;
				el.checked = b
			}, () => {})
		)

	LauncherAPI.getAutoInject()
		.then(
			_ => _.match((b) => {

				setAutoInject(b === 'true' ? true : false)
				let el = document.getElementsByName('toggle2')[1] as HTMLInputElement;
				el.checked = b === 'true' ? true : false
				console.log(`rthr[tpohrekth[perothk[erptohke[rptohk ${b}, ${el.checked}, ${autoInject}`)
			}, (err) => {console.log(err)})
		)
	})



	return (
		<div className="layout-cell layout-scrollbar" style ={{
			width : '100%',
			height : '100%',
			marginLeft : 'auto',
			marginRight : 'auto',
			position : 'relative',
			display : 'flex',
			flexDirection : 'row',
		}}>
			
			<div style ={{
				width : '100%',
				height : '100%',
			}}>

				<ProfileComponent description={strings.НастройкиЛаунчера} changeColor>
				<div style ={{
					display : 'flex',
					flexDirection : 'column',
					width : '100%',
					marginBottom : '10px',
				}}>
					{SelectLang()}


					{AutoLaunch()}

					<div style={{
						display: 'flex',
						flexDirection: "row",
						width: '100%',
						height: '20px',
						alignItems: 'center',
						marginTop: '10px',
					}}>
						<label>
							{strings.Автоинжект}
						</label>
						<div className="shadow znakVoprosa" data-title={`${strings['Лаунчер обнаруживает запущенную игру и инжектит чит.']} ༼ つ ◕_◕ ༽つ`}>
							<img style={{marginBottom : "2px", filter : "invert(100%) sepia(0%) saturate(0%) hue-rotate(182deg) brightness(102%) contrast(103%)"}}
							src={znakVoprosa}/>
						</div>

						<div style={{ marginLeft: "auto", marginRight: '10px' }}>
							<span className="toggle-bg" onClick={async () => {

								let el = document.getElementsByName('toggle2')[1] as HTMLInputElement
								setAutoInject(!el.checked)
								console.log(autoInject, "GTA5.exe")
								LauncherAPI.setAutoInject(el.checked, "GTA5.exe")
								}}>
								<input style={{cursor : 'pointer' }} type="radio" name="toggle2" value="off" />
								<input style={{cursor : 'pointer' }} type="radio" name="toggle2" value="on" /> 
							<span className="switch" />
							</span>
						</div>
					</div>




				</div>
				</ProfileComponent>
				
				<ProfileComponent description={strings['Прочее']}>
					<div style ={{
						display : "flex",
						flexDirection : 'column',
					}}>
						<label>{`${strings['Путь к файлам чита']}:`}</label>
						<div style ={{
							display : 'flex',
							marginTop : '10px',
						}}>
							<span className="noselect" style ={{
								color : 'grey',
								background : '#181818',
								borderRadius : '6px',
								padding : '3px',
								marginTop : '-3px',
								cursor : 'pointer',
							}}
							onClick={() => {
								LauncherAPI.writeInClipboard('C:\\ProgramData\\Sasavn')
								NotificationsManager.Append({
									state : new NotificationConstantState(`${strings['Скопировано в буфер']}!`, ``)
								})

							}}
							>{'C:\\ProgramData\\Sasavn'}</span>
							<Button style={{
								width : 'fit-content',
								height : '25px',
								fontSize : "15px",
								marginLeft : '15px',
								marginTop : '-3px',
								letterSpacing : '0px',
							}}
							onClick={() => LauncherAPI.showInExplorer('C:\\ProgramData\\Sasavn')}>
								{strings['Открыть']}
							</Button>
						</div>
					</div>
					
					
				</ProfileComponent>
				<div style ={{
					paddingBottom : '50px',
				}} />
			</div>
		</div>
	)

	function SelectLang() {
		return <div style={{
			display: 'flex',
			flexDirection: 'row',
		}}>
			<div style={{
				color: 'white',
				marginTop: '10px',
			}}>
				{strings.Язык}
			</div>
			<form id='selectLang' style={{
				marginLeft: 'auto',
				marginRight: '10px',
				marginTop: '7px'
			}}>
				<select
				 	name='lang' className='select' autoFocus={false}
					defaultValue={UserStore.getLang()}
					onChange={SelectLanguage()}>
					<option value="ru">
						Русский
					</option>
					<option value="en">
						English
					</option>
				</select>
			</form>
		</div>;
	}

	function SelectLanguage() {
		return () => {
			let form = new FormData(document.getElementById('selectLang') as HTMLFormElement);
			let lang = form.get('lang') as string | null;
			if (lang && lang === 'ru' || lang === 'en') {
				strings.setLanguage(lang)
				UserStore.setLang(lang)
			}
		};
	}

	function AutoLaunch() {
		return <div style={{
			display: 'flex',
			flexDirection: "row",
			width: '100%',
			height: '20px',
			alignItems: 'center',
			marginTop: '10px',
		}}>
			<label>
				{strings.Автозапуск}
			</label>
			<div className="shadow znakVoprosa" data-title={`${strings['Лаунчер запускается вместе с Windows.']} (ಠ_ಠ)`} color-lol="palevioletred" >
							<img style={{marginBottom : "2px", filter : "invert(100%) sepia(0%) saturate(0%) hue-rotate(182deg) brightness(102%) contrast(103%)"}}
							src={znakVoprosa}/>
			</div>

			<div style={{ marginLeft: "auto", marginRight: '10px' }}>
				<span className="toggle-bg" onClick={async () => {
					let el = document.getElementsByName('toggle1')[1] as HTMLInputElement;
					setAutoLaunch(!el.checked);
					await LauncherAPI.setAutoLaunch(el.checked);
				} }>
					<input style={{ cursor: 'pointer' }} type="radio" name="toggle1" value="off" />
					<input style={{ cursor: 'pointer' }} type="radio" name="toggle1" value="on" />
					<span className="switch" />
				</span>
			</div>

		</div>;
	}
})

export default Settings