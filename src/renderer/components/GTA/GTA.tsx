/* eslint-disable jsx-a11y/alt-text */

import { Progress } from "electron-dl"
import { either } from "fp-ts"
import { pipe } from "fp-ts/lib/function"
import { reaction } from "mobx"
import React, { useEffect, useState } from "react"
import Main  from "renderer/Main"
import LauncherAPI from "renderer/Model/LauncherApi"
import SasavnAPI from "renderer/Model/SasavnApi"
import LauncherError from "renderer/ReturnTypes/LauncherError"
import ResponseError from "renderer/ReturnTypes/ResponseError"

import strings from "renderer/store/strings"
import UserStore from "renderer/store/UserStore"
import GtaPresent from '../../Entity/GtaPresent.png'
import NotificationsManager, { NotificationErrorState, NotificationState } from "../Notifications/NotificationsManager"
import { NotifactionOnProgressState, ProgressObservable, ProgressObservableImpl } from "../Workshop/Notifications/NotifactionOnProgress/NotifactionOnProgressState"
import * as LauncherModel from '../../../../launcher_model/pkg/launcher_model'
import Button from "../Button/Button"


export default function GTA() { 

	let [isDownloading, setDownloading] = useState(false)
	let [_, rerender] = useState(false)

	useEffect(() => {
		let r1 = reaction(() => UserStore.user, (user) => {
			console.log('wegerjtyjportyjktrypjo')
			rerender(!_)
		})
		return () => r1()
	})

	return (
		<div style = {{
		width : '100%',
		height : '100%',
		display : 'flex',
		flexDirection : 'row',
		}}>
			<div style ={{
				display : 'flex',
				flexDirection : 'column',
				width  : '100%',
			}}>

				
				<div className='unselectable' style ={{
					marginLeft : 'auto',
					marginRight : 'auto',
					height : '150px',
					zIndex : 0,
				}}>
					<img className='unselectable shadow' src ={GtaPresent} style ={{
						width : 'calc(100% - 5px)', 
						height :"100%",
						borderRadius : "10px"
						}} />
			
				</div>
				<label style ={{
					fontSize : "20px",
					fontWeight : 'bold',
					marginLeft : 'auto',
					marginRight : 'auto',
					marginTop : '50px',
					color : 'white',
				}}>
					{strings.ИнструкцияПоЗапуску}
					<p style ={{fontWeight : 'normal'}}>{`1) ${strings.ЗапуститьИгру}`}</p>
					<p style ={{fontWeight : 'normal'}}>{`2) ${strings.НажатьКнопкуInject}`}</p>
					<p style ={{fontWeight : 'normal'}}>{`3) ${strings.ПодождатьОкончанияЗагрузки}`}</p>
			
				</label>
				<div style ={{
					marginLeft : 'auto',
					marginRight : '30px',
					marginTop : 'auto',
					marginBottom : '20px',
				}}>
					<div style={{
						width : "140px",
						height : '50px'
					}}>
						{InjectButton()}
					</div>
				</div>

			</div>
		</div>)


	function InjectButton() {
		console.log(UserStore.user)
		console.log(isDownloading)
		console.log(UserStore.user && !isDownloading)
		if(UserStore.user && !isDownloading)
			return <Button id='батон' style={{
				fontSize : '25px',
				height : '40px',
				paddingLeft : '10px',
				paddingRight : '10px'
			}}
				onClick={() => {inject()}}>
				Inject
			</Button>
		else {
			return <Button disabled style={{
				background : 'gray',
				fontSize : '25px',
				height : '40px',
				paddingLeft : '10px',
				paddingRight : '10px'
			}}>
			Inject
		</Button>
		}
	}

	async function inject() {
		
		let exist = await LauncherAPI.checkInjectorExist()
		let versionOnClient = await LauncherAPI.getVersionInjector()

		LauncherAPI.log('check exist')
		LauncherAPI.log('getVersionInjector')
		exist.match(
			async (_ : true) => {
				versionOnClient.match(
					async (versionOnClient : string) => {
						LauncherAPI.log(versionOnClient)
						let _ = await SasavnAPI.getCurrentVersionInjector()
							LauncherAPI.log(_)
							_.match(
								async (versionOnServer) => {
									LauncherAPI.log(versionOnServer.version)
									let path = await LauncherAPI.getSasavnFolderPath()

									if(versionOnServer.version > versionOnClient)
										await DownloadInjector(versionOnServer.version)

									await LauncherAPI.launchExe(`${path.left()}/Sasavn Injector.exe`)
								},
								async (e : ResponseError) => {
									NotificationsManager.Append({
										state : new NotificationErrorState(strings.НеУдалосьЗагрузитьЛаунчер, `${strings.Ошибка} ${e.message}`)
									})
								}
							)
						},
						async (e : LauncherError) => {
							LauncherAPI.log(e)
						}
				)
			},

			async (e : LauncherError) => {

				NotificationsManager.Append({
					state : new NotificationErrorState(strings.НеНайденИнжектор, strings.ЛибоОнНеБылУстановленЛибоЕгоУдалилАнтивирус)
				})
				LauncherAPI.log(`lol injector exisn't`)
				await DownloadInjector()


		})
		
		function downloadInjectorProgress(remove: () => void, progress : ProgressObservable) {
			let ipc = window.electron.ipcRenderer
			ipc.on('injector-downloaded', async () => { 
				setDownloading(false)
				LauncherAPI.log('Сасавн хак загружен')
				let path = (await LauncherAPI.getSasavnFolderPath()).left()
				console.log(path)
				if(path)
					await LauncherAPI.launchExe(`${path}/Sasavn Injector.exe`)

				remove() 
			})

			ipc.on('injector-downloading', (...args: unknown[]) => {
				let _progress = args[0] as Progress
				progress.Append(_progress.percent * 100)
			})
		}

		async function DownloadInjector(versionOnServer? : string) {
			
			let 
			_ = await LauncherAPI.downloadInjector(`${SasavnAPI.server}/files/injector/Sasavn Injector.exe`, () => {
				
				let progress = new ProgressObservableImpl()
				NotificationsManager.Append({
					state: new NotifactionOnProgressState(strings["Загрузка инжектора"], strings.Подождите, progress),
					id : 'loadInjector'
				}, (remove) => { 
					downloadInjectorProgress(remove, progress)
					
				 }, (not) => {not.state = new NotifactionOnProgressState(strings["Загрузка инжектора"], strings.Подождите, progress)}
				)
			})
			await _.match(
				async () => {
					if(versionOnServer)
						await LauncherAPI.setVersionInjector(versionOnServer)
					else {
						let 
						_ = await SasavnAPI.getCurrentVersionInjector()
						_.match(
							async (version) => {
								await LauncherAPI.setVersionInjector(version.version)
							},
							async (e : ResponseError) => {
								LauncherAPI.log(e)
							}
						)
					}
				},
				async (err: LauncherError) => {
					NotificationsManager.Append({
						state: new NotificationErrorState(strings.Ошибка, strings["Не удалось загрузить инжектор"])
					})
				}
			)
		}
	}
}