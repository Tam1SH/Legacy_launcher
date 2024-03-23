import ResponseError from "../ReturnTypes/ResponseError";
import TokenResult from "../ReturnTypes/TokenResult";
import SasavnAPI from "./SasavnApi";
import Result from "../Result";
import Cookies from "universal-cookie";
import RefreshTokenResult from "../ReturnTypes/RefreshTokenResult";
import SessionInfo from "../ReturnTypes/SessionInfo";

export default class SasavnApiAuthenticate {


	static async closeSession(refreshToken : string) : Promise<Result<SessionInfo[], ResponseError>> {

		return new Promise((resolve, reject) => {
			
			const formData = new FormData();
			formData.append('refreshToken', refreshToken)
			SasavnAPI.fetch({
				resolve, 
				response : `${SasavnAPI.server}/api/authenticate/closeSession/`,
				body : formData,
				typeResponse : 'POST'
			})
		})
	}

	static async refreshToken() : Promise<Result<RefreshTokenResult, ResponseError>> {

		return new Promise((resolve, reject) => {
			
			const cookies = new Cookies()
			const formData = new FormData();
			formData.append('RefreshToken', cookies.get('refreshToken'))
			formData.append('accessToken', cookies.get('accessToken'))

			SasavnAPI.fetch({
				resolve, 
				response : `${SasavnAPI.server}/api/authenticate/refreshToken`, 
				typeResponse : 'POST', 
				body : formData, 
				typeResult : 'json'
			})
		})
	}



}