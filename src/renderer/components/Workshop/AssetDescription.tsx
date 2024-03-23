import React, { useEffect, useState } from 'react'
import AssetInfo from '../../Info/AssetInfo'
import noImage from '../../Entity/noImage.jpg'
import strings from '../../store/strings'
import ImageSlider from 'react-simple-image-slider'
import install_lol from '../../Entity/install_lol.png'
import count_viewers from '../../Entity/count_viewers.png'
import { either, random } from 'fp-ts'
import SasavnAPI from '../../Model/SasavnApi'
import { pipe } from 'fp-ts/lib/function'
import DefaultIcon from '../../Entity/DefaultIcon.jpg'
import LauncherAPI from '../../Model/LauncherApi'
type AssetDescriptionProps = {
	asset: AssetInfo;
};



export default function AssetDescription(props: AssetDescriptionProps) {

	const [userIcon, setUserIcon] = useState(DefaultIcon)
	
	useEffect(() => {getProfileImage()})
	
	function date(string : string) {
		let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
		return new Date(string).toLocaleDateString(options as any)
	}

	async function getProfileImage() {
		
		let 
		_ = await SasavnAPI.getUserProfileImage(props.asset.author)

		setUserIcon(_.match(
			(url) => url,
			(err) => {
				LauncherAPI.log(err)
				LauncherAPI.log('error download user image ' + err)
				return DefaultIcon
			}
		))
	}
	
	return <div style={{ display: 'flex', flexDirection: 'column', width : '460px', height : 'fit-content', margin : 'auto'}}>

		<div className ='shadow' style ={{
			height : '90px',
			background : '#323232',
			borderRadius : '5px',
			marginLeft : '10px',
			marginTop : '10px',
			display : 'flex',
			border : '1px solid #858585',
			padding : 5,
		}}>
			<div style ={{
				display : 'flex',
				marginTop : '10px',
				width : '100%',
			}}>
				<div style ={{
					marginLeft : '10px',
					width : '70px',
					height : '70px',
					borderRadius : '50%',
					overflow : 'hidden',
				}}>
					<img src={userIcon}/>
				</div>

				<div style ={{
					display : 'flex',
					flexDirection : 'column',
					marginLeft : '15px',
				}}>
					<label style={{
						color: 'white',
						marginBottom: '5px',
					}}>
						<span style={{ fontWeight: 'bold' }}>{strings['Автор ассета']}</span> : {props.asset.author}
					</label>

					<label style={{
						color: 'white',
						marginBottom: '10px',
					}}>
						<span style={{ fontWeight: 'bold' }}>{strings['Название ассета']}</span> : {props.asset.name}
					</label>
				</div>

				<div style ={{
					marginLeft : 'auto',
					height : 'calc(100% + 10px)',
					marginTop : '-10px',
					display : 'flex',
					flexDirection : 'column',
				}}>
					<div style ={{
						display : 'flex',
						marginBottom : 'auto',
						marginLeft : 'auto',
						marginRight : '10px',
					}}>
						<label style={{
							color: 'white',
							marginBottom: '10px',
						}}>
							{date(props.asset.date)}
						</label>
					</div>

					<div style ={{
						marginTop : 'auto',
						marginLeft : 'auto',
						marginRight : '10px',
						marginBottom : '5px',
					}}>
						<div style ={{
							display : 'flex',
							flexDirection : 'row',
						}}>
							<div style ={{
								width : '20px',
								height : '20px',
								marginRight : '5px',
							}}>
								<img src={install_lol}/>
							</div>
							<label style={{
								fontSize : '16px',
								fontWeight : 'bold',
								marginRight : '5px',
								marginTop : '-2px',
								marginBottom : '0px',
							}}>
								{props.asset.countInstall}
							</label>

							<div style ={{
								width : '25px',
								height : '15px',
								marginLeft : '10px',
								marginRight : '5px',
							}}>
								<img src={count_viewers}/>
							</div>
							<label style={{
								fontSize : '16px',
								fontWeight : 'bold',
								marginTop : '-2px',
								
								marginBottom : '0px',
							}}>
								{props.asset.viewCount}
							</label>

						</div>
					</div>


				</div>


			</div>
		</div>
		<div className='workshop-image-holder shadow' id="image" style ={{
			marginTop : '10px',
			marginLeft : '10px',
			width : '450px',
		}}>
			{currentAssetImageExist() &&  props.asset.presentImages.length > 1 && <>
				<ImageSlider 
					width={450}
					height={400}
					images={props.asset.presentImages.map(image => image.imagePath!)}
					showNavs
					style ={{
						width : '100%',
						backgroundColor : 'transparent',
						position : 'relative',
					}}
					showBullets={false}/>
			</>}
			{currentAssetImageExist() && props.asset.presentImages.length === 1 && <>
				<img src = {props.asset.presentImages[0].imagePath} style ={{
					width : 450,
					height : 300
				}}/>
			</>}
			{!currentAssetImageExist() && <> 
				<img src = {noImage} style ={{
					width : 450,
					height : 300
				}}/>
				</>}
		</div>

		<div style ={{
			marginTop : '20px',
			marginLeft : '10px',
			display : 'flex',
			flexDirection : 'column',
			marginBottom : '70px',
		}}>
			<label style ={{
				fontSize : '20px',
				fontWeight : 'bold',
			}}>
				{`${strings['Описание']}:`}
			</label>
			{props.asset.description.length !== 0 ? 
			<label style ={{
				marginLeft : '5px',
				display : 'flex',
				wordBreak : 'break-all',
			}}>{props.asset.description}</label> 
				: <label style ={{
					marginLeft : '5px',
					display : 'flex',
					wordBreak : 'break-all',
					color : 'gray',
				}}>
					{strings['Описания для этого ассета нет.']}
				</label>}
		</div>
	</div>


	function currentAssetImageExist() {
		return props.asset.presentImages && props.asset.presentImages[0] && props.asset.presentImages[0].imagePath
	}

}
