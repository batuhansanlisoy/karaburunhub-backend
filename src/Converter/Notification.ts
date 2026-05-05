import { Notification } from "../Entity/Notification";

export class NotificationConverter {
    static toResponse(notification: Notification) {
        return notification;
    }

    static toListResponse(notifications: Notification[]) {
        return notifications.map(b => NotificationConverter.toResponse(b));
    }
}
