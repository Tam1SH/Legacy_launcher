export default class UserData {
	id : number

	login : string

	email : string

	Role_legacy : string

	money : number

	hwid : string

	constructor(id : number,
		login : string,
		email : string,
		Role_legacy : string,
		money : number,
		hwid : string) {
			this.id = id
			this.login = login
			this.email = email
			this.Role_legacy = Role_legacy
			this.money = money
			this.hwid = hwid
		}
}
