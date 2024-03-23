import React, { ButtonHTMLAttributes, useRef } from 'react'
import './Button.css'
import cn from 'classnames'
import { ClipLoader } from 'react-spinners'

type ButtonProps = ButtonHTMLAttributes<HTMLDivElement> & {
	isSubmit? : boolean,
}

export default function Button(
	props : React.PropsWithChildren<ButtonProps>
) {
	
	const {isSubmit, ...props_} = {...props}

	return (
	<div className={cn('buttonOuter', {
		'submit' : isSubmit,
		'green' : true
	})} {...props_}>

		<button className={cn('button', {
			'submit' : isSubmit
		})}>
			{props_.children}
		</button>

		<div className='____loader_____'>
			<ClipLoader color='white' size={20}/>
		</div>
	</div>
	)
}

export function PurpleButton(
	props : React.PropsWithChildren<ButtonProps>
) {
	
	const {isSubmit, ...props_} = {...props}
	return (
		<div className={cn('buttonOuter', {
			'submit' : isSubmit,
			'purple' : true,
		})} {...props_}>
	
			<button className={cn('button', {
				'submit' : isSubmit
			})}>
				{props_.children}
			</button>
	
			<div className='____loader_____'>
				<ClipLoader color='white' size={20}/>
			</div>
		</div>
	)
}