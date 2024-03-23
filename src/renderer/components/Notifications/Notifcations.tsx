
import { useEffect, useState } from "react"
import NotificationComponent from "./Notification"
import NotificationsManager, { Notification } from "../../Notifications/NotificationsManager"
import './Notifications.css'

export default function Notifications() {

	const [nots, setNots] = useState<Notification[]>([])

	const listener = (nots : Notification[]) => setNots([...nots])

	useEffect(() => {
		NotificationsManager.addListener(listener)
		setNots(NotificationsManager.getCurrentNots())
		return () => NotificationsManager.removeListener(listener)
	}, [])

	return <div className="NotifactionAlign">
			{nots.map((not, i) => <NotificationComponent {...not} index={i} id={not.id!}/>)}
		</div>
}