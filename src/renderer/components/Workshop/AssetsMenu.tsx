/* eslint-disable react/prop-types */

import React, { ReactElement, useEffect, useState } from 'react';
import strelka from '../../Entity/strelka.svg';
import SasavnAPI from '../../Model/SasavnApi';
import AssetInfo from '../../Info/AssetInfo';
import noImage from '../../Entity/noImage.jpg';
import { pipe } from 'fp-ts/lib/function';
import { either } from 'fp-ts';
import * as LauncherModel from '../../../../launcher_model/pkg/launcher_model'
import крутилка from '../../Entity/крутилка.png'
import './Workshop.css'
import { reaction } from 'mobx';
import { observer } from "mobx-react-lite"
import AssetsStore from '../../store/AssetsStore';
import strings from '../../store/strings';

type AssetsMenuProps = {
	onClick?: (e: React.MouseEvent, assetId: number) => void;
};

export default function AssetsMenu(props: AssetsMenuProps) {
	return (
		<>
			<div id="nested" className='workshop-asset-menu-shadow layout-cell layout-scrollbar workshop-assets-menu'>
				<AssetsList onClick={props.onClick} />
			</div>
		</>
	);
}

type AssetPreviewProps = {
	info: AssetInfo;
	onClick?: (e: React.MouseEvent, assetId: number) => void;

};

function AssetPreview(props: AssetPreviewProps) {

	function onClick(e: React.MouseEvent) {
		if (props.onClick) {
			props.onClick(e, props.info.id);
		}
	}

	function currentAssetImageExist() {
		return props.info && props.info.presentImages && props.info.presentImages[0] && props.info.presentImages[0].imagePath;
	}
	
	return (
		<div className='workshop-asset-preview'
			onClick={onClick}>
			<div className='shadow asset'>
				{currentAssetImageExist() && <img src={props.info.presentImages[0].imagePath} />}
				{!currentAssetImageExist() && <img src={noImage} />}
			</div>

			<label className='assetText'>
				{props.info.name}
			</label>
		</div>
	);

}

class OnClickWrapperInfo {
	onClick?: (e: React.MouseEvent, assetId: number) => void;
}

//По сути всю бы эту хуйню отрефакторить с учётом того, что нужно везде учитывать зафилтрованны они или нет
//Но как-то похуй
const  AssetsList = observer((props : OnClickWrapperInfo) => {

	const [assetIds, setAssetIds] = useState(Array<number>());
	const [currentIndexList, setCurrentIndexList] = useState(0)
	const [countAllList, setCountAllList] = useState(0)
	const [countAllListIfFindningSomeAsset, setCountAllListIfFindningSomeAsset] = useState(0)
	const [findingAssets, setFindingAssets] = useState(false)
	const [filteredAssets, updateFindingAssetsList] = useState(Array<AssetInfo>())

	useEffect(() => {
		
		if(AssetsStore.length() < 8) {
			
			AssetsStore.downloadAssets(16)
		}
		
		let count = AssetsStore.totalLength()
		let num = Math.ceil(count / 8) - 1
		if(num > 0)
			setCountAllList(num)
		else 
			setCountAllList(0)
		setAssets(0)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function setFindingAssets_(currentPage : number) {
		let assetsIndexes = LauncherModel.return_assets_indexes(currentPage, filteredAssets.length)
		setAssetIds(Array.from(assetsIndexes))
	}

	async function setAssets(currentPage : number) {

		if((currentPage + 1) * 8 > AssetsStore.length()) {
			await AssetsStore.downloadAssets(16)
		}
		let length = 0
		if(AssetsStore.Assets.length < 8) {
			length = AssetsStore.Assets.length
		}

		else length = 8
		let assetsIds = AssetsStore.Assets.slice(length * currentPage, length * currentPage + 8).map(asset => asset.id)
		setAssetIds(assetsIds)
	}

	function onClickLeft() {
		
		if (currentIndexList > 0) {
			let calcIndex = currentIndexList - 1
			if(!findingAssets)
				setAssets(calcIndex)
			else 
				setFindingAssets_(calcIndex)
			setCurrentIndexList(calcIndex)
		}

	}

	function onClickRight() {
		let count = findingAssets ? countAllListIfFindningSomeAsset : countAllList
		if (currentIndexList < count) {
			let calcIndex = currentIndexList + 1
			if(!findingAssets)
				setAssets(calcIndex)
			else 
				setFindingAssets_(calcIndex)
			setCurrentIndexList(calcIndex)
			
		}
	}
	
	const ifFindingAssets = (findingAssetName : string) => {
		let cond = findingAssetName.length !== 0
		setFindingAssets(cond)

		if(cond) {
			//TODO: подгружать с сервака ассеты если не найдены здесь.
			//А точнее уже высирать прямо близкие по названию, а не скачивать все поочереди.
			let filteredAssets = AssetsStore.getAssets()
				.filter(asset => asset.name.includes(findingAssetName))

			updateFindingAssetsList(filteredAssets)
			
			//TODO: не сказал бы что туту, но я хуй знает как это работает, так что мб придётся дебажить.
			let countPages = Math.ceil(filteredAssets.length / 8) - 1
			if(countPages >= 0)
				setCountAllListIfFindningSomeAsset(Math.ceil(filteredAssets.length / 8) - 1)
			else 
				setCountAllListIfFindningSomeAsset(0)
		}
	}

	const reloadAssets = async () => {
		AssetsStore.reset()
		await AssetsStore.downloadAssets(16)
	}
	
	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
			height: '100%',
		}}>

			<div style={{
				minHeight: '40px',
				display : 'flex',
				width : '100%',
				flexDirection : 'row',
				alignItems: 'center',
			}}>
				<form id='findAssets' style ={{width : '100%'}}>
					<input name='name' className='login-menu-field-input' style ={{
						marginTop : "0px",
						width : 'calc(100% - 5px)',
						marginBottom  : '0px',
						marginLeft : '0px',
					}}

					onChange={(e) => {ifFindingAssets(e.target.value)}}
					placeholder={`${strings['Найдётся что угодно']}... :)`}/>
				</form>

				<div style ={{
					width : '30px',
					height : '30px',
					marginLeft : '5px',
				}} onClick={async () => {
					let checkbox = document.getElementById('lolllll') as HTMLInputElement
					
					checkbox.checked = !checkbox.checked
					await reloadAssets()
					checkbox.checked = !checkbox.checked

				}}>
					<input type="checkbox" id='lolllll' style={{visibility : 'hidden', position : 'absolute'}}/>
					<img className='spinner-epta' src={крутилка} />
				</div>

			</div>

			<div style={{
				marginTop: '20px',
				width: '100%',
				paddingBottom: '50px',
			}}>
				<div style={{
					width: '100%',
					borderRadius: '5px',
					background: '#4F4F4F',
				}}>

				<div style ={{
					display : 'grid',
					gridTemplateColumns : 'repeat(auto-fit, 180px)',
					padding : '25px',
				}}>
					{!findingAssets && ShowAssetPreviews()}

					{findingAssets && 
						filteredAssets.map((asset, i) => <AssetPreview info={asset} onClick={props.onClick} />)}
				</div>


					<AssetPagesSelector
						onClickLeft={onClickLeft}
						onClickRight={onClickRight}
						onClickNumber={(num) => {
							setCurrentIndexList(num - 1)
							setAssets(num - 1)
						}}
						currentIndexList={currentIndexList}
						countAllList={!findingAssets ? countAllList : countAllListIfFindningSomeAsset}
					/>
				</div>
			</div>
		</div>
	);

	function ShowAssetPreviews() {
		
		let assets = AssetsStore.getAssets().filter(asset => {
			return !assetIds.every(id => asset.id !== id)
		})
		return assets.map((asset, i) => <AssetPreview info={asset} onClick={props.onClick} key={asset.id} />)
	}
})

type AssetPagesSelectorProps = {
	onClickLeft : () => void
	onClickRight : () => void
	onClickNumber : (num : number) => void
	currentIndexList : number
	countAllList : number
}

function AssetPagesSelector(props : AssetPagesSelectorProps) {
	return (
		<div style={{
			margin: 'auto',
			display: 'flex',
			overflow: 'hidden',
		}}>
			<div style={{
				display: 'flex',
				flexDirection: 'row',
				height: '70px',
				margin: 'auto',
			}}>
				<div style={{
					margin: 'auto',
					display: 'flex',
					flexDirection: 'row',
				}}>
					
					<div onClick={props.onClickLeft}>
						<img src={strelka} className='workshop-asset-menu-arrow-left'/>
					</div>

					<div style={{display: 'flex'}}>
						{formatNumbers(props.currentIndexList + 1).map((number) => `${props.currentIndexList + 1}` !== number ? 
							<label className='workshop-asset-menu-number-pages' onClick={() => {props.onClickNumber(+number)}}>
								{number}
							</label>
						: <label className='workshop-asset-menu-selected-page'>{number}</label>
						)}
					</div>

					<div onClick={props.onClickRight}>
						<img src={strelka} className='workshop-asset-menu-arrow-right'/>
					</div>

				</div>
			</div>
		</div>
	)

	//Бля, ну тип снизу стрелочки и там цифры и кароче тип:
	// <1,2,3,..., 668>
	// или
	// <4,5,6,7,8,..., 668>
	// или
	// <664,665,666,667,668>
	function formatNumbers(index: number) {
		let numbers: number[] = [];
		let max = props.countAllList + 1;
		if (index - 2 > 0) {
			numbers.push(index - 2);
			console.log(`push ${index - 2}`)
		}
		if (index - 1 > 0) {
			numbers.push(index - 1);
			console.log(`push ${index - 1}`)
		}
		if (index !== max) {
			numbers.push(index);
			console.log(`push ${index}`)
		}
		if ((index + 1) < max) {
			numbers.push(index + 1);
			console.log(`push ${index + 1}`)
		}
		if ((index + 2) < max) {
			numbers.push(index + 2);
			console.log(`push ${index + 2}`)
		}
		if ((index + 3) < max) {
			numbers.push(index + 3);
			console.log(`push ${index + 3}`)
		}

		numbers.push(max);

		let format : string []= numbers.map(n => `${n}`)

		if ((index + 4) < max) {
			format.push('...');
		}

		return format;
	}
}

