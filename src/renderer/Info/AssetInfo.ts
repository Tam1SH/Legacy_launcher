
export interface PresentImages {
	id : number,
	imageId : number | undefined,
	imagePath : string | undefined,
}

export interface Content {
	id : number,
	contentId : number | undefined,
	contentPath : string | undefined,
}

export default interface AssetInfo {
	id : number
	name : string
	author : string
	presentImages : PresentImages[]
	content : Content[]
	description : string
	type : string
	date : string
	countInstall : number
	viewCount : number
}