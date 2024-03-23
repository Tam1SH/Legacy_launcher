class ResponseError extends Error {
	code : number
	
	message : string

	constructor(message : string, code : number) {
		super(message)
		this.code = code
		this.message = message
	}
}

export default ResponseError;