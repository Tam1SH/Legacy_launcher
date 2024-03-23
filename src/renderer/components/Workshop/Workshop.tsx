/* eslint-disable promise/no-nesting */
import React, { PropsWithChildren, useEffect, useLayoutEffect, useReducer, useState } from 'react'
import plus from '../../Entity/plus.svg'
import Some from '../../Entity/Some.png'
import strelka from '../../Entity/strelka.svg'
import install from '../../Entity/install.png'
import SasavnAPI from '../../Model/SasavnApi'
import AssetInfo from '../../Info/AssetInfo'
import Main from '../../Main'
import { either, eitherT, number, option, string } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import ResponseError from 'renderer/ReturnTypes/ResponseError'
import AssetsStore from 'renderer/store/AssetsStore'
import AssetDescription  from './AssetDescription'
import HiddenableComponent from '../HiddenableComponent'
import AssetsMenu  from './AssetsMenu'
import { Link, Redirect } from 'react-router-dom'
import * as signalR from '@aspnet/signalr'
import SasavnSocketAPI from 'renderer/Model/SasavnNotificationAPI'
import UserStore from 'renderer/store/UserStore'
import WorkshopAssetCreating from './WorkshopAssetCreating'
import edit_button from '../../Entity/edit_button.svg'
import WorkshopStore from '../../store/WorkshopStore'
import { reaction } from 'mobx'
import NotificationsManager, { NotificationConstantState, NotificationDialogState, NotificationErrorState, NotificationState, NotificationStaticState, NotificationSuccessState } from '../Notifications/NotificationsManager'
import strings from 'renderer/store/strings'
import LauncherAPI from 'renderer/Model/LauncherApi'
import { ConfigProvider, Drawer, Modal } from 'antd'
import Button from '../Button/Button'



export default function Workshop() {
	
	const [isListVisible, setListVisible] = useState<boolean>(false)
	const [currentAssetId, setCurrentAsset] = useState<number>(-1)

	useEffect(() => {
		if(AssetsStore.currentAsset) {
			SasavnAPI.incAssetViewCount(AssetsStore.currentAsset.id)
		}
	})
	
	useEffect(() => {

		let l = reaction(() => AssetsStore.Assets, (assets) => {
			
			console.log('assets changed', currentAssetId)
			if(currentAssetId !== -1) {
				pipe(AssetsStore.getAssetById(currentAssetId), option.match(
					() => {
						console.log('ассет не найден, похоже на баг')
					},
					a => {
						AssetsStore.currentAsset = a
						setCurrentAsset(a.id)
					}
				))
			}
		})
		return () => {l()}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])


	function onClickAsset(e : React.MouseEvent, asset : number) {
		if(asset) {
			setCurrentAsset(asset)
			setListVisible(false)
			onClose()
		}
	}

	function deleteAsset(asset : AssetInfo) {
		SasavnAPI.deleteAsset(asset.id)
			.then(result => result.match(
				(_) => {
					setCurrentAsset(-1)
					NotificationsManager.Append({
						state : new NotificationConstantState(strings['Ассет удалён'], '')
					})
					// eslint-disable-next-line prefer-destructuring
					AssetsStore.currentAsset = AssetsStore.Assets[0]
				},
				(err) => {
					NotificationsManager.Append({
						state : new NotificationErrorState(strings['Ошибка'], err.message)
					})
				},
			))
	}

	function presentCurrentAsset() {
		
		return pipe(AssetsStore.getAssetById(currentAssetId), option.match(
			() => {
				console.log('ассет не найден') 
				return undefined
			},
			a => {
				AssetsStore.currentAsset = a
				return <AssetDescription asset={a}/>
			}
		))
	}

	const [open, setOpen] = useState(false);

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	return(
		<>
			{presentCurrentAsset()}
			{presentCurrentAsset() && <InstallButton/>}
			{AssetsStore.currentAsset && presentCurrentAsset() && UserStore.isAdmin() && <>
				<HiddenableComponent
					external='external__'
					nested='nested__'
					eventType='mousedown'>	

					<EditButtonMenu
						asset={AssetsStore.currentAsset}
						onClickDelete={() => {
							NotificationsManager.Append({
								state : new NotificationDialogState(strings['Удалить ассет?'], '', 
								() => deleteAsset(AssetsStore.currentAsset!))
							})
						}}
						onClickEdit={() => {}}
					/>

				</HiddenableComponent>

			</>}

			<AddAssetAndListAssetsButtons 
				onClickShowAssets={() => {showDrawer()}}
			/>
			<ConfigProvider theme={{
				components : {
					Drawer : {
						colorBgElevated: '#323232',
						padding : 0,
						paddingLG : 0,
						paddingXS : 0
					},
				}
			}}>
				<Drawer
					placement="right"
					onClose={onClose}
					open={open}
					getContainer={false}
					footer={false}
					closable={false}
					width={'auto'}
					className='jopa'
					style={{borderRadius : '10px', height : 'calc(100vh - 50px)'}}
					>
					<AssetsMenu onClick={onClickAsset}/>
				</Drawer>
			</ConfigProvider>

		</>
	)
	

	function offsetStyle() {

		let calcLeft = '-400px'
		if (isListVisible)
			calcLeft = '470px'

		let style : React.CSSProperties = {
			position : 'fixed',
			left : `calc(100% - ${calcLeft})`,
			display : 'flex',
			flexDirection : 'row',
			transition : '0.2s',
		}
		
		return style
	}
}


type EditButtonMenuProps = {
	asset : AssetInfo
	onClickDelete : () => void
	onClickEdit? : () => void
}

function EditButtonMenu(props : EditButtonMenuProps) {
	const [nigger, setNigger] = useState(false)

	return <div className='edit-button-menu1 shadow' id='nested__'>
		<div style ={{
			width : '100%',
			marginTop : '5px',
		}}>
			<label style={{
				marginRight : '10px',
				marginLeft : '10px',
			}}
			onClick={() => {
				let {asset} = props
				
				setNigger(true)
				WorkshopStore.id = asset.id
				WorkshopStore.contentSaved = asset.content
				WorkshopStore.description = asset.description
				WorkshopStore.imagesSaved = asset.presentImages
				WorkshopStore.name = asset.name
				WorkshopStore.isEditing = true
				WorkshopStore.callback = props.onClickEdit
			}}>
				{strings['Редактировать']}
				{nigger && <Redirect to='WorkshopAssetEditing'/>}
			</label>
		</div>

		<div style ={{
			width : '100%',
			marginBottom : '5px',
		}}>
			<label style={{
				marginRight : '10px',
				marginLeft : '10px',
			}} 
			onClick={props.onClickDelete}>
				{strings['Удалить']}
			</label>
		</div>
	</div>
}

function EditButton() {

	return (
		<div id='external__'>
			<div className='workshop-edit-button'>
				<img src={edit_button} style={{
					width : '50%',
					margin : 'auto',
					filter : 'invert(100%) sepia(100%) saturate(0%) hue-rotate(132deg) brightness(103%) contrast(103%)'
				}}/>
			</div>
		</div>
	)
}

type AddAssetAndListAssetsButtonsProps = {
	onClickShowAssets : () => void
}

function AddAssetAndListAssetsButtons(props : AddAssetAndListAssetsButtonsProps) {
	return (
		<div style ={{
			display : 'flex',
			flexDirection : "column",
			position : 'fixed',
			left : 'calc(100% - 50px)'
		}}>
			<div style ={{
				width : '50px',
				height : '50px',
				display : 'flex',
			}}>
				<Link to='/WorkshopAssetCreating' id="WorkshopEdit" className = 'inject-button mne-poxyu' style ={{
					margin : 'auto',
					width : '40px',
					height : '40px',
					display : 'flex',
					borderRadius : '50%',
				}}>
					<img id="WorkshopEdit" src={plus} style ={{
						width : '20px',
						height : '20px',
						margin : 'auto',
						filter : 'invert(100%) sepia(0%) saturate(7500%) hue-rotate(38deg) brightness(112%) contrast(107%)',
					}} />
				</Link>
			</div>

			<div style ={{
				width : '50px',
				height : '50px',
				display : 'flex',
			}}>
				<button id="external" className = 'inject-button mne-poxyu' style ={{
					margin : 'auto',
					width : 'calc(35px + 0.5vw)',
					height : 'calc(35px + 0.5vw)',
					maxWidth : '50px',
					maxHeight : '50px',
					display : 'flex',
					borderRadius : '50%',
					zIndex : 1,
				}}
				onClick={props.onClickShowAssets}>
				
					<img src={Some} style ={{
						width : 'calc(20px + 0.5vw)',
						height : 'calc(20px + 0.5vw)',
						margin : 'auto',
						//filter : 'invert(100%) sepia(0%) saturate(7500%) hue-rotate(38deg) brightness(112%) contrast(107%)',
						
					}} />
				</button>
			</div>
			<div style ={{
				marginTop : '5px',
			}}/>
			{UserStore.isAdmin() && <EditButton/>}
		</div>
	)
}


function InstallButton() {
	const [niiger, setNigger] = useState(false)
	return <>
		<div style ={{
			position : "fixed",
			left : 'calc(50% - 10px)',
			right : '50%',
			top : 'calc(100% - 50px)',
		}}>
			<div style={{ display : 'flex', flexDirection : "row"}}>

				<form onSubmit={async (e) => {
					//animation: spinner___ 0.8s infinite linear
					//workshop-install-button

					//button.disabled = false
					e.preventDefault()
					let button = document.getElementById('INSTALL_BUT') as HTMLButtonElement
					let def = button.style.background
					
					button.style.background = 'grey'
					button.style.animation = 'spinner___ 0.8s infinite linear'
					//button.disabled = true
					await installAsset()
					
					button.style.background = def
					button.style.animation = ''
				}}>
					<button type='submit' className = 'inject-button workshop-install-button shadow' id ="INSTALL_BUT">
						<img src={install} id = "INSTALL"/>
					</button>
				</form>
				
			</div>
		</div>
		
	</>;

	async function installAsset() {
		let asset = AssetsStore.currentAsset
		if(asset) {
			(await SasavnAPI.installAsset(asset.id))
				.match(
					async (file) => {
						if(asset) {

							let isWho = (ext_ : string) => asset!.content.some(c => {
								let ext = c.contentPath?.split('.').pop()
								if(ext === ext_) {
									return true
								}
								return false
							});
							console.log(JSON.stringify(asset.content))
							let isLua = isWho('lua');
							let isXml = isWho('xml');
							console.log(isLua)
							
							if(isLua) {
								(await LauncherAPI.downloadAsset(`Lua/`, file))
								.match(
									() => {
										NotificationsManager.Append({
											state : new NotificationSuccessState(strings['Файл скачан'], '')
										})
									},
									(err) => {
										NotificationsManager.Append({
											state : new NotificationErrorState(strings['Ошибка 2'], err.message)
										})
										LauncherAPI.log(`asset - ` + err)
									}
								)
							} else if(isXml) {
								(await LauncherAPI.downloadAsset(`EntDB/`, file))
								.match(
									() => {
										NotificationsManager.Append({
											state : new NotificationSuccessState(strings['Файл скачан'], '')
										})
									},
									(err) => {
										NotificationsManager.Append({
											state : new NotificationErrorState(strings['Ошибка 2'], err.message)
										})
										LauncherAPI.log(`asset - ` + err)
									}
								)
							}


						}
						else {
							NotificationsManager.Append({
								state : new NotificationErrorState(strings['Ошибка 2'], '')
							})
							LauncherAPI.log('asset is null')
						}

					},
					async (err : ResponseError) => {
						NotificationsManager.Append({
							state : new NotificationErrorState(strings['Ошибка 2'], err.message)
						})
						console.log(err)
					}
			)
		}
			

	}
}



