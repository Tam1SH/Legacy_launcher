import { makeAutoObservable } from "mobx"
import LauncherAPI from "./Model/LauncherApi"
import Environment from "./ReturnTypes/Environment"
import strings from "./store/strings"
import UserStore from "./store/UserStore"

class GlobalState {

	static async setLang() {

		let userLang1 = (await LauncherAPI.getLang()).left()
		if(userLang1 && userLang1 === 'en' || userLang1 === 'ru') {
			strings.setLanguage(userLang1)
			UserStore.setLang(userLang1)
		}
		else {
			let userLang = navigator.language
			
			if(userLang.includes("ru")) {
				LauncherAPI.log('поставлен язык - ru')
				strings.setLanguage('ru')
				UserStore.setLang('ru')
	
			}
			else if(userLang.includes("en")) {
				LauncherAPI.log('поставлен язык - en')
				strings.setLanguage('en')
				UserStore.setLang('en')
			}
			else {
				LauncherAPI.log('поставлен язык - en')
				strings.setLanguage('en')
				UserStore.setLang('en')
			}
		}


	}

	launcherVersion : string | null = null

	environment : Environment | null = null
	
	constructor() {
		makeAutoObservable(this)
	}

	setMainInfo() {
		GlobalState.setLang()
		LauncherAPI.getLauncherVersion().then(
			version => 
				version.match(
					(version : string) => {

						this.launcherVersion = version
					},
					(err) => {
						LauncherAPI.log('try again get launcher version')
						LauncherAPI.log(err.message)
						setTimeout(() => this.setMainInfo(), 5000)
					}
				)
		)
		LauncherAPI.getEnvironment().then(
			env => env.match(
				(env : Environment) => {this.environment = env},
				(err) => {
					LauncherAPI.log('try again get env')
					LauncherAPI.log(err.message)
					setTimeout(() => this.setMainInfo(), 5000)
				}
				)
		)
	}

}

export default new GlobalState()