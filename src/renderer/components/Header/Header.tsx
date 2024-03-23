import Head from "../Head";
import HeadElements from "../HeadElements";
import Icon from "../IconSasavn";
import Close from "./Close";
import Minimize from "./Min";
import Notifications from "../Workshop/Notifications/Notifcations";
import Helmet from "react-helmet"

export default function Header() {
	return (<>
		<Helmet title = "Sasavn Launcher"/>
		<Notifications/>
		<Head> 
			<HeadElements>
				<Close/>
				<Minimize/>
				<Icon/>
			</HeadElements>
		</Head>
	</>
	)
}