import { ConfigProvider, MenuProps } from 'antd';
import Dropdown from 'antd/es/dropdown/dropdown';
import React from 'react';
import strings from './store/strings';
import LauncherAPI from './Model/LauncherApi';

type VersionProps = {
	version: string | null
};
export default function Version(props: VersionProps) {
	const items: MenuProps['items'] = [
		{
		  label: <div>
			<label style={{marginRight : "5px"}}>
				{strings['Какие-то проблемы?']}
			</label>
			<label style={{textDecoration : "underline", cursor : 'pointer'}} onClick={() => LauncherAPI.RedirectToSite('https://discord.gg/invite/hrcYWaX')}>{strings['пишите сюда']}</label>
		  </div>,
		  key: '0',
		}
	  ];
	  

	return (
		<div style={{
			position: 'fixed',
			left: 'calc(100% - 50px)',
			top: 'calc(100% - 25px)',
			color: '#3E3E3E'
		}}>
			<ConfigProvider theme={{components : {
			Dropdown: {
				colorBgBase: '#323232',
				colorBgContainer: '#323232',
				colorPrimary: '#323232',
				colorPrimaryBg: '#323232',
				colorBgElevated: '#323232',
				colorBgLayout: '#323232',
				colorBgMask: '#323232',
				fontFamily: 'SUS2',
				colorBorder: '#5a5a5a',
				borderRadiusLG: 10,
				paddingXXS: 5,
				colorBorderBg: '#5a5a5a',
				colorBorderSecondary: '#5a5a5a',
				borderRadiusOuter: 10,
				borderRadiusSM: 10,
				controlItemBgHover: 'transparent',
			},
			}}}>
				<Dropdown menu={{items}}>
					<label style={{color : 'gray', textDecoration : "underline"}}>{props.version ? props.version : 'error'}</label>
				</Dropdown>
			</ConfigProvider>

		</div>
	);
}
