

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import goBack from '../../Entity/goBack.png';
import SasavnAPI from '../../Model/SasavnApi';
import Main from '../../Main';
import { either, tuple as Tuple } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { Link, Redirect, useLocation } from 'react-router-dom';
import strings from 'renderer/store/strings';
import upload from '../../Entity/upload.png'
import крестик from '../../Entity/Крестик.svg'
import добавить_файл from '../../Entity/добавить_файл.png'
import NotificationsManager, { NotificationConstantState, NotificationErrorState, NotificationState } from '../Notifications/NotificationsManager';
import lua from '../../Entity/lua_pic.png'
import xml from '../../Entity/xml.png'
import { map } from 'fp-ts/lib/Array';
import UserStore from 'renderer/store/UserStore';
import WorkshopStore from '../../store/WorkshopStore';
import AssetInfo, { Content, PresentImages } from 'renderer/Info/AssetInfo';
import AssetsStore from 'renderer/store/AssetsStore';


class FileEntity {
	file : File 

	constructor(file : File) {
		this.file = file
	}

}

class FileFromServerEntity {
	path : string 

	constructor(path : string) {
		this.path = path
	}
}

const useComponentWillMount = (cb : any) => {
    const willMount = useRef(true)

    if (willMount.current) cb()

    willMount.current = false
}

export default function WorkshopAssetEditing() {
	
	const [selectedImage, setSelectedImage] = useState<Array<FileEntity | FileFromServerEntity>>([])
	const [selectedContent, setSelectedContent] = useState<Array<FileEntity | FileFromServerEntity>>([])
	const [description, setDescription] = useState("")
	
	const [isCreatedAssetValid, setCreatedAssetValid] = useState(true);
	const [isNameValid, setNameValid] = useState(true);
	const [isFileSelectedValid, setFileSelectedValid] = useState(true);
	const [isContentSelectedValid, setContentSelectedValid] = useState(true);
	const [isValided, setValided] = useState(false)
	const [isAssetCreatedOrSaved, setAssetCreatedOrSaved] = useState(false) 
	const [ifIsEditing_AssetInfo] = useState<AssetInfo | undefined>()
	

	const lol = useComponentWillMount(() => {
		if(WorkshopStore.imagesSaved) {
			
			let images : Array<FileEntity | FileFromServerEntity> = []

			WorkshopStore.imagesSaved.forEach(image => {
				if(image.imagePath)
					images.push(new FileFromServerEntity(image.imagePath))
			})

			selectedImage.forEach(image => images.push(image))

			images = [...new Set(images)]

			setSelectedImage(images)
		}
			
		if(WorkshopStore.contentSaved)  {
			let content : Set<FileEntity | FileFromServerEntity> = new Set()
			WorkshopStore.contentSaved.forEach(_content => {
				if(_content.contentPath)
					content.add(new FileFromServerEntity(_content.contentPath))
			})

			selectedContent.forEach(image => content.add(image))
			let _content = Array.from(content)

			if(JSON.stringify(_content) !== JSON.stringify(selectedContent))
				setSelectedContent(Array.from(content))
		}
		
	})
	

	useEffect(() => {
		
		if(WorkshopStore.description) {
			let area = document.getElementById('description') as HTMLTextAreaElement
			area.value = WorkshopStore.description
		}
		let input = document.getElementById('workshop_field_0') as HTMLInputElement
		input.value = WorkshopStore.name
		//let input5 = document.getElementById('workshop_field_5') as HTMLInputElement
		//input5.value = AssetsStore.currentAsset?.viewCount.toString() ?? ''
		//let input4 = document.getElementById('workshop_field_4') as HTMLInputElement
		//input4.value = AssetsStore.currentAsset?.countInstall.toString() ?? ''
		let input3 = document.getElementById('workshop_field_3') as HTMLInputElement
		input3.value = AssetsStore.currentAsset?.author ?? ''

	})

	const validateCreatedAssetAndUpload = async () => {

		let formData5 = new FormData(document.getElementById('name3') as HTMLFormElement);
		let author = formData5.get('name') as string
		let formData = new FormData(document.getElementById('name') as HTMLFormElement);
		let name = formData.get('name') as string

		setValided(false)
		setNameValid(true);
		setFileSelectedValid(true);
		setContentSelectedValid(true);
		setCreatedAssetValid(true);

		if (name?.length === 0) {
			setNameValid(false)

		}


		if (selectedContent.length === 0) {
			setContentSelectedValid(false)
		}


		if (selectedImage.length === 0) {
			setFileSelectedValid(false)
		}


		if (isNameValid) {
			let userName = UserStore.getUser()
			if(userName) {
				
				let _description = description
				if(!_description) {
					_description = WorkshopStore.description ?? ""
				}
				
				let [picsFromServer, _addedImages] = sortImagesByCategory()
				let [contentFromServer, _addedContent] = sortContentByCategory()
				
				let addedImages = _addedImages.map(image => image.file)
				let addedContent = _addedContent.map(cotnent => cotnent.file)

				let savedImages : PresentImages[] = []
				let savedContent : Content[] = []

				picsFromServer.forEach(pic => {
					let pic_ = WorkshopStore.imagesSaved?.find(image => image.imagePath === pic.path)
					if(pic_)
						savedImages.push(pic_)
				})

				contentFromServer.forEach(pic => {
					let c = WorkshopStore.contentSaved?.find(image => image.contentPath === pic.path)
					if(c)
						savedContent.push(c)
				})

				let 
				_ = await SasavnAPI.editAsset(
					WorkshopStore.id, author, name, _description, 
					addedImages, savedImages, addedContent, savedContent)

				_.match(
					(result) => {
						console.log(result)
						NotificationsManager.Append({
							state : new NotificationConstantState('Ассет изменён ёпта' ,'')
						})
						if(WorkshopStore.callback)
							WorkshopStore.callback()
						setAssetCreatedOrSaved(true)
					},
					(err) => {
						NotificationsManager.Append({
							state : new NotificationErrorState('Бля косяк, я долбоёб' , err.message)
						})
					}
				)


			}
			else {
				NotificationsManager.Append({
					state : new NotificationErrorState('юзер не зареган' ,'')
				})
			}
		}
		//else {
		//	setCreatedAssetValid(false)
		//	setValided(true)
		//}
			
	};


	function sortContentByCategory() : [FileFromServerEntity[], FileEntity[]] {
		let picsFromServer : FileFromServerEntity[] = []
		let picsFromClient : FileEntity[] = []

		selectedContent.forEach(image => {
			if (image instanceof FileEntity) {
				picsFromClient.push(image);
			}
			if (image instanceof FileFromServerEntity) {
				picsFromServer.push(image);
			}
		});

		return [picsFromServer, picsFromClient]
	}

	function sortImagesByCategory() : [FileFromServerEntity[], FileEntity[]] {
		let picsFromServer : FileFromServerEntity[] = []
		let picsFromClient : FileEntity[] = []

		selectedImage.forEach(image => {
			if (image instanceof FileEntity) {
				picsFromClient.push(image);
			}
			if (image instanceof FileFromServerEntity) {
				picsFromServer.push(image);
			}
		});

		return [picsFromServer, picsFromClient]
	}


	function getPath(path: string) {
		return `atom://${path}`;
	}

	function onSelected_(files : FileList | undefined, currentLength : number, max : number) {

		if(files === undefined) {
			return undefined
		}
		
		if(files.length === 0) {
			NotificationsManager.Append({
				state : new NotificationErrorState(strings['Не удалось найти файл'],'')
			})
			return undefined
		}

		let files_ : File[] = [] 
		for(let i = 0; i < files.length; i++) {
			if(files.item(i))
				files_.push(files.item(i)!)
		}

		let _selectedFilesPaths = pipe(files_, map((f : File) => f))

		if(_selectedFilesPaths.length + currentLength > max) {
			NotificationsManager.Append({
				state : new NotificationErrorState(strings[`Загружено больше чем ${7} изображений`],'')
			})

			let cutedImagePaths = _selectedFilesPaths.filter((_, i) => (currentLength + i) < 7)

			return cutedImagePaths
		}
		else 
			return _selectedFilesPaths


	}
	//setSelectedContentPaths

	async function onSelectedFiles(files? : FileList) {
		let result = onSelected_(files, selectedContent.length, 2)?.map(file => new FileEntity(file))
		if(result) {
			setSelectedContent(selectedContent.concat(result))
		}
	}

	async function onSelectedImage(files? : FileList) {
		let result = onSelected_(files, selectedImage.length, 7)?.map(file => new FileEntity(file))
		if(result) {
			let selectedImages = selectedImage.concat(result)
			setSelectedImage(selectedImages)
		}
		
	}

	function onClickDeleteImage(src : string) {
		
		let src_ = src.replace('atom://', '')
		let selectedImages = selectedImage.filter(entity => {
			if(entity instanceof FileEntity) 
				return entity.file.path !== src_

			return entity.path !== src
		})

		setSelectedImage(selectedImages)
		//if(WorkshopStore.isEditing) {
		//	WorkshopStore.imagesSaved = selectedImages as string[]
		//}
	}

	function onClickDeleteFile(src : string) {
		let src_ = src.replace('atom://', '')
		let filename = src_.split('\\').pop()
		console.log(filename)

		let contents = selectedContent.filter(entity => {
			if(entity instanceof FileFromServerEntity)
				return !entity.path.includes(filename!)
			return !entity.file.path.includes(src)
		})

		setSelectedContent(contents)

		//if(WorkshopStore.isEditing) {
		//	WorkshopStore.contentSaved = contents as string[]
		//}

		
	}

	
	return (
		<>
			<BackButton/>
			{isAssetCreatedOrSaved && <Redirect to ='/Workshop'/>}
			<div style ={{
				marginTop : '20px',
				padding : '10px',
				height : '100vh',
			}}>
				{/*Название*/}
				<div style ={{
					display : "flex",
					flexDirection : 'column',
					marginBottom : '50px',
				}}>

					<div style ={{
						display : 'flex',
						marginTop : '20px',
					}}>
						<label style={{
						fontWeight: 'bold',
						}}>
							{`${strings['Автор ассета']}:`}
						</label>

						<form id="name3" style={{
							height: '20px',
							marginRight: '-10px',
							marginLeft: '-10px',
						}}>
							<input id="workshop_field_3" name='name' className='login-menu-field-input' style={{
								height: '20px',
								width : 'fit-content',
								marginTop: '0px',
							}} />
						</form>
					</div>
					

					<div style ={{
						marginTop : '20px',
						display : 'flex',
					}}>
						<label style={{
						fontWeight: 'bold',
						}}>
							{`${strings['Название ассета']}:`}
						</label>

						<form id="name" style={{
							height: '20px',
							marginRight: '-10px',
							marginLeft: '-10px',
						}}>
							<input id="workshop_field_0" name='name' className='login-menu-field-input' style={{
								height: '20px',
								width : 'fit-content',
								marginTop: '0px',
							}} />
						</form>
					</div>

				</div>
				{/*Изображения*/}
				<div style ={{
					display : 'flex',
					flexDirection : "column",
					width : 'calc(100vw - 100px)',
					marginBottom : '50px',
				}}>
					<label style={{fontWeight: 'bold'}}>
						{`${strings['Загрузите изображения']}:`}
					</label>

					<div style ={{
						display : 'grid',
						gridAutoRows : '100px',
						gridTemplateColumns : 'repeat(auto-fit, 100px)',
						columnGap : '20px',
						rowGap : '20px',
						margin : '10px',
					}}>
						{selectedImage.map(entity => <DeletableFile 
							src={entity instanceof FileEntity ? getPath(entity.file.path) : entity.path} 
							onClick={onClickDeleteImage}
							onError={onClickDeleteImage}
							/>)}	

						{(selectedImage.length < 7) && <UploadFileFragment 
							onSelectedFiles={onSelectedImage}
							imagePlaceHolder={upload}
							extensions='.png,.jpg,.jpeg'
							height='50%'
						/>}
					</div>
				</div>
				{/*Описание*/}
				<div style ={{
					display : 'flex',
					flexDirection : 'column',
					marginBottom : '50px',
				}}>
					<label style={{fontWeight: 'bold'}}>
						{`${strings['Придумайте описание(опционально)']}:`}
					</label>

					<textarea id='description' spellCheck='true' wrap='soft' maxLength={1000} className='login-menu-field-input layout-scrollbar' style ={{
						margin : '0px',
						marginTop : '10px',
						minHeight : '200px',
						font : 'message-box',
						resize : 'none',
					}}
					onChange={((e) => {setDescription(e.target.value)})}
					placeholder={WorkshopStore.isEditing ? WorkshopStore.description : 'bla-bla-bla'}/>
				</div>
				{/*Контент*/}
				<div style ={{
					display : 'flex',
					flexDirection : 'column',
					marginBottom : '50px',
				}}>
					<label style={{fontWeight: 'bold'}}>
						{`${strings['Выберите контент']}:`}
					</label>

					<div style ={{
						display : 'grid',
						gridAutoRows : '100px',
						gridTemplateColumns : 'repeat(auto-fit, 100px)',
						columnGap : '20px',
						rowGap : '20px',
						margin : '10px',
					}}>

						{selectedContent.map(entity => {
							let ext = ""
							let filename = ""
							
							if(entity instanceof FileEntity) {
								ext = entity.file.path.split('.').pop()!
							 	filename = entity.file.path.split('\\').pop()!
							}
							else {
								ext = entity.path.split('.').pop()!
								filename = entity.path.split('\\').pop()!
							}

							let pic = ''
							if (ext === 'lua') {
								pic = lua
							}
							if (ext === 'xml') {
								pic = xml
							}
							
							return <DeletableFile 
								src={pic} 
								name={filename}
								onClick={onClickDeleteFile}
								onError={onClickDeleteFile}
						/>})}

						{selectedContent.length <= 2 && <UploadFileFragment 
							onSelectedFiles={onSelectedFiles}
							imagePlaceHolder={добавить_файл}
							extensions='.lua,.xml'
							height='55%'
						/>}
					</div>
				</div>
				{/*Скачать*/}
				<div style ={{
					margin : '10px',
				}}>
					<button className='inject-button' style ={{
						letterSpacing : '0px',
						width : 'auto',
						marginBottom : '50px',
					}}
					onClick={async () => {validateCreatedAssetAndUpload()}}>
						{!WorkshopStore.isEditing && strings['Опубликовать']}
						{WorkshopStore.isEditing && 'отредактировать ёпты'}
					</button>
				</div>
			</div>
		</>
	);
}



type DeletableImageProps = {
	src : string
	name? : string
	onClick : (name : string) => void
	onError : (src : string) => void
}

//Костылестроение.
function DeletableFile(props : DeletableImageProps) {

	//let src = `atom:///${props.src}`
	//console.log(src)
	return (
		<div style ={{
			display : 'flex',
			flexDirection : 'column',
			height : 'fit-content',
		}}>
			<div className='workshop-editor-delete-file' style={{cursor : "pointer"}}
			onClick={() => {
				if(props.name)
					props.onClick(props.name)
				else 
					props.onClick(props.src)
			}
			} onError={(e) => {
				
				
				if(props.name)
					props.onError(props.name)
				else 
					props.onError(props.src)

				NotificationsManager.Append({
					state : new NotificationErrorState(strings['Не удалось найти файл'],'')
				})
			}}>
				<img src={props.src} loading='lazy'/>
				<img src={крестик} style ={{
					position : 'relative',  
					width : '70px', 
					height : '70px', 
					transform : 'translate(-120%, 25%)'}}/>
			</div>
		{props.name && <label style ={{margin : 'auto',	textOverflow: 'ellipsis', width : '100%', overflow: 'hidden', fontSize : '14px'}}>{props.name}</label>}
		</div>
	)
}

type UploadFileFragmentProps = {
	onSelectedFiles : (files? : FileList) => void
	imagePlaceHolder : string
	height : string
	extensions : string
}

function UploadFileFragment(props : UploadFileFragmentProps) {
	return (
	<div className='workshop-editor-upload-image' style={{cursor : 'pointer'}}>
		<label htmlFor={`__JOPA${props.extensions}`} style ={{width : '100%', height : '100%', display : 'flex', cursor : 'pointer',}}>
			<img src={props.imagePlaceHolder} style ={{
					width : "50%",
					height : props.height,
					margin : 'auto',
					cursor : 'pointer',
			}}/>
		</label>
		<input type='file' id={`__JOPA${props.extensions}`} accept={props.extensions} multiple required style ={{
			opacity : 0,
			position :'absolute',
			top : 0,
		}}
		onChange={(e) => props.onSelectedFiles(e.target.files!)}/>
	</div>
	)
}

function BackButton() {
	return <div style={{
		position: 'fixed',
		left: `calc(100% - 45px)`,
		top: '55px',
	}}>
		<Link to='Workshop' id="Workshop" className='inject-button mne-poxyu' style={{
			margin: 'auto',
			width: '40px',
			height: '40px',
			display: 'flex',
			borderRadius: '50%',
		}}>
			<img id="Workshop" src={goBack} style={{
				width: '20px',
				height: '20px',
				margin: 'auto',
				filter: 'invert(100%) sepia(0%) saturate(7500%) hue-rotate(38deg) brightness(112%) contrast(107%)',
			}} />
		</Link>

	</div>;
}

