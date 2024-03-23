
import { makeAutoObservable, observable } from "mobx"

import ChangeLog from "../ReturnTypes/ChangeLog"

class ChangesStore {

	changeLogs = new Array<ChangeLog>()


	addChangeLog(changelog : ChangeLog) {
		this.changeLogs.push(changelog)
	}

	addChangeLogs(changeLogs: ChangeLog[]) {
		this.changeLogs = this.changeLogs.concat(changeLogs)

		//Лол, сгенерено ИИ
		const sortedLogs = this.changeLogs.sort((a, b) => {
			if (a.version > b.version) { // поменяли оператор сравнения
			  	return -1; // поменяли знак сравнения
			}
			if (a.version < b.version) { // поменяли оператор сравнения
			  	return 1; // поменяли знак сравнения
			}
			return 0;
		});

		const uniqueLogs = sortedLogs.reduce((acc: ChangeLog[], log) => {
			const existingLog = acc.find(l => l.version === log.version)
			if (!existingLog) {
				acc.push(log)
			}
			return acc
		}, [])
		
		this.changeLogs = uniqueLogs
	}

	getChangeLogs() {
		return this.changeLogs
	}

	constructor() {
		makeAutoObservable(this)
	}

}

export default new ChangesStore()