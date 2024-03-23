import { reaction } from "mobx"
import UserStore from "renderer/store/UserStore"

export type NotificationType = 'dynamic' | 'constant' | 'static' | 'dialog'

export class NotificationState {
	title : string

	description : string | undefined

	type : NotificationType

	constructor(title : string, description : string | undefined, type : NotificationType) {
		this.title = title
		this.description = description
		this.type = type

	}
}

export class NotificationDialogState extends NotificationState {
	
	onLeft? : () => void

	onRight? : () => void

	constructor(title : string, description : string | undefined, onLeft? : () => void, onRight? : () => void) {
		super(title, description, 'dialog')
		this.onLeft = onLeft
		this.onRight = onRight

	}
}

export class NotificationStaticState extends NotificationState {
	constructor(title : string, description : string | undefined) {
		super(title, description, 'static')
	}
}

export class NotificationConstantState extends NotificationState {
	constructor(title : string, description : string | undefined) {
		super(title, description, 'constant')
	}
}
export class NotificationSuccessState extends NotificationState {
	constructor(title : string, description : string | undefined) {
		super(title, description, 'constant')
	}
}


export class NotificationErrorState extends NotificationState { 

	constructor(title : string, description : string | undefined) {
		super(title, description, 'constant')
	}

}

export interface NotificationObservable {

    addListener(o : NotificationListener) : void
    removeListener(o : NotificationListener) : void
    notify() : void
}

interface NotificationListenerClass {
	update(nots : Notification[]) : void
}

interface NotificationListenerFunction {
	(nots : Notification[]) : void
}

export type NotificationListener = NotificationListenerClass | NotificationListenerFunction


export type Notification = {
	state : NotificationState
	id? : string
}

class NotifcationsManager implements NotificationObservable{

	private visiblesNots : Notification[] = []

	private listeners : NotificationListener[] = []

	addListener(o: NotificationListener) {
		this.listeners.push(o)
	}
	
	removeNotById(notId : string) {
		this.visiblesNots = this.visiblesNots.filter((not) => not.id !== notId)
		this.notify()
	}

	removeListener(l: NotificationListener) {
		this.listeners = this.listeners.filter((l_) => l_ !== l)
	}

	notify() {
		this.listeners.forEach(l => {
			if(typeof l === 'function')
				l(this.visiblesNots)
			else {
				l.update(this.visiblesNots)
			}
		})
	}

	getCurrentNots() {
		return this.visiblesNots
	}
	
	Append(not : Notification, callback? : (remove : () => void) => void, changeLang? : (not : Notification) => void) {

		if(!not.id) {
			not.id = this.visiblesNots.length.toString()
		}

		if(not.state.type === 'dialog') {
			this.visiblesNots.push(not)
			this.notify()
		}

		if(not.state.type === 'constant') {
			setTimeout(() => {
				this.visiblesNots = this.visiblesNots.filter((not_) => not !== not_)
				this.notify()
			}, 3500) //3500
			this.visiblesNots.push(not)
			this.notify()
		}
		else if(not.state.type === 'dynamic') {
			if(callback)
				callback(() => {
					this.visiblesNots = this.visiblesNots.filter((not_) => not !== not_)
					this.notify()
				})
			else console.warn('нет callback для уведомления с непостоянный лайф таймом')
			this.visiblesNots.push(not)
			this.notify()

		}
		else if(not.state.type === 'static') {

			if(callback) {
				let disponser = reaction(() => UserStore.lang, (lang) => {
					if(changeLang)
						changeLang(not)
				})
				callback(() => {
					this.visiblesNots = this.visiblesNots.filter((not_) => not !== not_)
					disponser()
					this.notify()
					
				})
			}
			else console.warn('нет callback для уведомления со статичным лайф таймом')


			if(!this.visiblesNots.find(not_ => not.id === not_.id)) {
				this.visiblesNots.push(not)
				this.notify()
			}
		}
	}
}

export default new NotifcationsManager()