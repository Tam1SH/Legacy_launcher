import { reaction } from "mobx";
import NotificationsManager, { NotificationStaticState } from "renderer/components/Notifications/NotificationsManager";
import strings from "renderer/store/strings";
import UserStore from "renderer/store/UserStore";

export default function NotIfNoLogin() {

	NotificationsManager.Append({
		state : new NotificationStaticState(strings.ОшибкаАвторизации, strings.ВойдитеВАккаунтЛибоЗарегистрируйтесьЧтобыПользоватьсяЛаунчером),
		id : 'NoLogin'
	}, () => {}, 
	(not) => {not.state = new NotificationStaticState(strings.ОшибкаАвторизации, strings.ВойдитеВАккаунтЛибоЗарегистрируйтесьЧтобыПользоватьсяЛаунчером)})
}
