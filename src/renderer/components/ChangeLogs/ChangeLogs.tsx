

import React, { useEffect, useRef, useState } from "react";
import ChangesStore from "../../store/ChangesStore";
import { reaction } from "mobx";
import strings from "../../store/strings";
import UserStore from "../../store/UserStore";
import './ChangeLogs.css'
import * as Loaders from 'react-spinners';
import { debounce, throttle } from "../../usefull";
import ChangeLog from "../../ReturnTypes/ChangeLog";
import ResponseError from "../../ReturnTypes/ResponseError";
import SasavnApi from "renderer/Model/SasavnApi";
import Spinner from "../Spinner";

function ChangeLogs() {

	const [offset, setOffset] = React.useState(0)
	const [changeLogs, setChangeLogs] = React.useState<ChangeLog[] | undefined>()
	const [totalChangeLogsCount, setTotalChangelogsCount] = useState<number>(0)
	const [isFailed, setFailed] = React.useState<boolean>(false)
	const [_, langChanged] = React.useState('')
	const [isLoading, setLoading] = useState(false)
	useEffect(() => {
		
		SasavnApi.getChangeLogsCount()
			.then(result => {
				result.match(
					(count) => setTotalChangelogsCount(count),
					() => {}
				)
			})

			
		let scroll = (event: Event) => {
			let scrollElement = document.getElementById('SCROLL')
			if(scrollElement) {
				if (scrollElement.offsetHeight + scrollElement.scrollTop >= scrollElement.scrollHeight) {
					AddChangelog()
	
				}
			}
		}

		let l = reaction(() => UserStore.lang, (lang) => {langChanged(lang)})
	
		if(ChangesStore.changeLogs.length === 0) {
			AddChangelog()
		}
		
		let scrollElement = document.getElementById('SCROLL')
		scrollElement?.addEventListener('scroll', scroll)
		return () => {
			scrollElement?.addEventListener('scroll', scroll)
			l()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	//Сгенерировано ИИ
	const mergeText = (text : string[]) => {

		const separators: { type: string; className: string }[] = [
			{ type: "Добавлено:", className: "added" },
			{ type: "Added:", className: "added" },
			{ type: "Исправлено:", className: "fixedStyle" },
			{ type: "Fixed:", className: "fixedStyle" }
		];

		type SeparatorPart = {
			type: "separator";
			item: string;
			className: string;
		};

		type ItemsPart = {
			type: "part";
			items: string[];
		};

		type Part = SeparatorPart | ItemsPart;

		const parts: Part[] = [];
		let i = 0;

		while (i < text.length) {
			const item = text[i];
			const separator = separators.find((s) => s.type === item);
			if (separator) {
				parts.push({ type: "separator", item, className: separator.className });
				i++;
			} else {
				const currentPart: ItemsPart = { type: "part", items: [] };
				// eslint-disable-next-line @typescript-eslint/no-loop-func
				while (i < text.length && !separators.some((s) => s.type === text[i].trim())) {
					const trimmedItem = text[i].trim();
					if (trimmedItem) {
					  currentPart.items.push(trimmedItem);
					}
					i++;
				  }
				  if (currentPart.items.length > 0) {
					parts.push(currentPart);
				  }
			}
		}


		return parts.map((part: Part) => {
			if (part.type === "separator") {
				return <p className={part.className}>{part.item}</p>
			} else {
				return <p className='defaultStyle'>{part.items.join("\n")}</p>
			}
		});

	}

	const format = (logs : ChangeLog[]) => {
		try {
			return logs.map((log : ChangeLog) => {
				return <div key={log.version} id={log.version} style ={{
					marginBottom : '150px',
				}}>
					<div style ={{
						display : 'grid',
						gridAutoFlow : 'column',
					}}>
						<p className="defaultVersionStyle" style ={{fontWeight : 'bold',}}>
							{log.version}
						</p>
						<div style ={{marginLeft : 'auto', color : 'darkgray'}}>
							<p className="defaultVersionStyle">
								{new Date(log.createDate).toLocaleDateString(UserStore.getLang())}
							</p>
						</div>
	
					</div>
					
					{mergeText(log.data[UserStore.getLang().toUpperCase()]!.split('\n'))}
					
				</div>
			})
		}
		catch(ex) {
			return <label>Error</label>
		}

	}


	const AddChangelog = debounce(() =>  {
		if(!(ChangesStore.changeLogs.length + 1 === totalChangeLogsCount)) {
			setLoading(true)
			SasavnApi.getChangeLogs(ChangesStore.changeLogs.length, 6)
				.then(result => {
					result.match(
						(logs: ChangeLog[]) => {
							ChangesStore.addChangeLogs(logs)
							setOffset(ChangesStore.changeLogs.length)
							setChangeLogs(logs)
							setLoading(false)
						},
						(_: ResponseError) => { 
							setFailed(true)
							setLoading(false)
						}
					)
				});
		}
	}, 500)

	return (
		<div className="container-row" style={{width : '100%',}}>
			<div style ={{
				display : 'flex',
				flexDirection : 'column',
				width : '100%',
			}}>
				<div  id='SCROLL' className="layout-scrollbar" style ={{
					height : '550px',
					overflowY : 'auto',
					display : 'flex',
				}}>
					<div style ={{margin : 'auto', padding : '50px'}}>
						{ChangesStore.changeLogs.length === 0 && <div style={{width : '100%', height : '100%'}}>
								<Spinner/>
						</div>}
						{isFailed && <label>{strings['Ошибка 2']}</label>}

						{format(ChangesStore.getChangeLogs())}

					</div>
				</div>

					{isLoading && <div style ={{
						width : "100%",
						background : `green`,
						display : 'flex',
					}}>
						<div style ={{
							margin : "auto",
							width : '40px',
							height : '40px',
							marginTop : '10px',
							marginBottom : '10px',
						}}>
							<Loaders.ClipLoader color="white"/>
						</div>
				</div>}
			</div>
		</div>
		
	)

}

export default ChangeLogs
