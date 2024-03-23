/* eslint-disable array-callback-return */

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import info from '../../Entity/info.svg';
import goBack from '../../Entity/goBack.png';
import SasavnAPI from '../../Model/SasavnApi';
import Main from '../../Main';
import { either } from 'fp-ts';
import LauncherAPI, { OpenDialogReturnValue } from 'renderer/Model/LauncherApi';
import { pipe } from 'fp-ts/lib/function';
import LauncherError from 'renderer/ReturnTypes/LauncherError';
import ResponseError from 'renderer/ReturnTypes/ResponseError';

import { Link, Redirect, useLocation } from 'react-router-dom';
import strings from 'renderer/store/strings';
import upload from '../../Entity/upload.png'
import крестик from '../../Entity/Крестик.svg'
import добавить_файл from '../../Entity/добавить_файл.png'
import NotificationsManager, { NotificationConstantState, NotificationErrorState, NotificationState } from '../Notifications/NotificationsManager';
import lua from '../../Entity/lua_pic.png'
import xml from '../../Entity/xml.png'
import * as LauncherModel from '../../../../launcher_model/pkg/launcher_model'
import { map } from 'fp-ts/lib/Array';
import UserStore from 'renderer/store/UserStore';
import WorkshopStore from '../../store/WorkshopStore';
import AssetInfo from 'renderer/Info/AssetInfo';



const useComponentWillUnmount = (callback: () => void) => {
    const mem = useRef<() => void>();

    useEffect(() => {
        mem.current = callback;
    }, [callback]);

    useEffect(() => {
        return () => {
            const func = mem.current as () => void;
            func();
        };
    }, []);
};

export default function WorkshopAssetCreating() {
	
	const [selectedImage, setSelectedImage] = useState<Array<File>>([])
	const [selectedContent, setSelectedContent] = useState<Array<File>>([])
	const [description, setDescription] = useState("")
	const [selectedContentNames, setSelectedContentNames] = useState<Array<string>>([])
	
	const [isCreatedAssetValid, setCreatedAssetValid] = useState(true);
	const [isNameValid, setNameValid] = useState(true);
	const [isFileSelectedValid, setFileSelectedValid] = useState(true);
	const [isContentSelectedValid, setContentSelectedValid] = useState(true);
	const [isValided, setValided] = useState(false)
	const [isAssetCreatedOrSaved, setAssetCreatedOrSaved] = useState(false) 

	const validateCreatedAssetAndUpload = async () => {

		let formData = new FormData(document.getElementById('name') as HTMLFormElement);
		let name = formData.get('name') as string;
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

			console.log(name, description, selectedImage, selectedContent);
			//SasavnAPI.server ="https://localhost:44397"
			let userName = UserStore.getUser()
			if(userName) {
				
				let _description = description
				if(!_description) {
					_description = WorkshopStore.description ?? ""
				}
				
				let savedImages: Array<File> = selectedImage
				let savedContent: Array<File> = selectedContent

				let 
				_ = await SasavnAPI.createAsset(userName.login, name, _description, savedImages, savedContent)
				_.match(
					(_) => {
						NotificationsManager.Append({
							state : new NotificationConstantState('Ассет успешно добавлен' ,'')
						})
						setAssetCreatedOrSaved(true)
					},
					(err) => {
						NotificationsManager.Append({
							state : new NotificationErrorState('Не удалось создать ассет' ,err.message)
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
	};


	function getPath(path: string) {
		return `atom://${path}`;
	}

	function onSelected_(files : FileList | undefined, currentLength : number, max : number) {

		if(!files) {
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

	async function onSelectedFiles(files? : FileList) {
		let result = onSelected_(files, selectedContent.length, 2)
		if(result) {
			setSelectedContent(selectedContent.concat(result))
			let result_ = result.map(filename => filename.path.split('\\').pop()!)
			console.log(result)
			setSelectedContentNames(selectedContentNames.concat(result_))
		}
	}

	async function onSelectedImage(files? : FileList) {
		let result = onSelected_(files, selectedImage.length, 7)
		if(result) {
			let selectedImages = selectedImage.concat(result)
			setSelectedImage(selectedImages)
		}
		
	}

	function onClickDeleteImage(src : string) {
		
		let src_ = src.replace('atom://', '')
		let selectedImages = selectedImage.filter(path => path.path !== src_)
		setSelectedImage(selectedImages)
	}

	function onClickDeleteFile(src : string) {
		let src_ = src.replace('atom://', '')
		let filename = src_.split('\\').pop()
		console.log(filename)

		let contents = selectedContent.filter(path => !path.path.includes(filename!))
		setSelectedContent(contents)

		setSelectedContentNames(selectedContentNames.filter(filename_ => filename_ !== filename))
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
					flexDirection : 'row',
					marginBottom : '50px',
				}}>
					<label style={{
						color: 'white',
						marginTop: '-5px',
						fontWeight: 'bold',
					}}>
						{`${strings['Придумайте название ассета']}:`}
					</label>

					<form id="name" style={{
						marginTop: '-5px',
						height: '20px',
						marginRight: '-10px',
						marginLeft: '-10px',
					}}>
						<input id="workshop_field_0" name='name' className='login-menu-field-input' style={{
							height: '20px',
							marginTop: '0px',
						}} />
					</form>
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
						{selectedImage.map(file => <DeletableFile 
							src={getPath(file.path)} 
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

						{selectedContent.map(file => {
							let	ext = file.path.split('.').pop()!
							let filename = file.path.split('\\').pop()!

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
						{strings['Опубликовать']}
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
			} onError={() => {
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

