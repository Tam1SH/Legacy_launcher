
import { NotificationState } from "../NotificationsManager"

export interface ProgressObservable {

    addListener(o : ProgressListener) : void
    removeListener(o : ProgressListener) : void
    notify() : void
	Append(currentProgress : number) : void
	getCurrentProgress() : number
}

interface ProgressListenerClass {
	update(percent : number) : void
}

interface ProgressListenerFunction {
	(percent : number) : void
}

export type ProgressListener = ProgressListenerClass | ProgressListenerFunction

export class ProgressObservableImpl implements ProgressObservable {

	private listeners : ProgressListener[] = []

	private currentProgress : number = 0

	getCurrentProgress() {
		return this.currentProgress
	}

	addListener(o: ProgressListener) {
		this.listeners.push(o)
	}
	
	removeListener(l: ProgressListener) {
		this.listeners = this.listeners.filter((l_) => l_ !== l)
	}

	notify() {
		this.listeners.forEach(l => {
			if(typeof l === 'function')
				l(this.currentProgress)
			else {
				l.update(this.currentProgress)
			}
		})
	}

	Append(currentProgress : number) {
		this.currentProgress = currentProgress
		this.notify()
	}
	
}

export class NotifactionOnProgressState extends NotificationState {

	//0..100
	observer: ProgressObservable;

	constructor(title: string, description: string | undefined, observer: ProgressObservable) {
		super(title, description, 'dynamic');
		this.observer = observer;
	}
}
