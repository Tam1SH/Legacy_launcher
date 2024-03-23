import { makeAutoObservable } from "mobx"
import AssetInfo, { Content, PresentImages } from "renderer/Info/AssetInfo"


class WorkshopStore {

	id : number = 0

	imagesSaved? : PresentImages[]

	images? : File[]

	contentSaved? : Content[]

	content? : File[]

	description? : string 

	name : string = ''

	asset : AssetInfo | undefined

	isEditing : boolean = false

	callback? : () => void

}

export default new WorkshopStore()