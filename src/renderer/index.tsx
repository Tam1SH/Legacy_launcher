/* eslint-disable @typescript-eslint/no-unused-expressions */
import { CookiesProvider } from 'react-cookie';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Updater from './components/Updater';
import GTA from './components/GTA/GTA';
import Settings  from './components/Settings';
import Workshop from './components/Workshop/Workshop';
import WorkshopAssetCreating from "./components/Workshop/WorkshopAssetCreating";
import ChangeLogs from './components/ChangeLogs/ChangeLogs';
import WorkshopAssetEditing from './components/Workshop/WorkshopAssetEditing';
import Main from './Main';
import GlobalState from './GlobalState';
import { observer } from 'mobx-react-lite';
import UserStore from './store/UserStore';
import { v4 } from 'uuid';
import { useEffect } from 'react';
import { makeAutoObservable, reaction } from 'mobx';

GlobalState.setMainInfo()
window.electron.ipcRenderer.invoke('isLoaded').then((isLoaded) => {
	console.log('lol, begin')
	const container = document.getElementById('root')!;
	const root = createRoot(container);
	
	const MainView = observer(() => 
	<CookiesProvider>
		<MemoryRouter>
			<Main>
				<Switch>
					<Route exact path='/' component={GTA}/>
					<Route path='/Settings' component={Settings} exact/>
					<Route path='/Workshop' component={Workshop} exact/> 
					<Route path='/WorkshopAssetCreating' component={WorkshopAssetCreating} /> 
					<Route path='/WorkshopAssetEditing' component={WorkshopAssetEditing} />
					<Route path='/ChangeLogs' component={ChangeLogs} exact/> 
				</Switch>
			</Main>
		</MemoryRouter>
	</CookiesProvider>)

	isLoaded 
	? root.render(<MainView/>)
	: root.render(
		<MemoryRouter>
			<Switch>
				<Route exact path="/" component={Updater} />
			</Switch> 
		</MemoryRouter>)
});
