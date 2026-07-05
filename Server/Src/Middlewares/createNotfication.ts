import { sendNotificationToUser } from '../Sockets/Handlers/notification.handler.js';

interface NotificationPayload {
    recipientId: string;
    title: string;
    message: string;
    type: 'NEW_LIKE' | 'MUTUAL_MATCH' | 'MATCH_ACCEPTED' | 'UNMATCHED';
}

export const sendNotification = async (payload: NotificationPayload) => {
    try {
        console.log(`[Notification to ${payload.recipientId}]: ${payload.title} - ${payload.message}`);
        
        // Emit real-time socket event
        sendNotificationToUser(payload.recipientId, 'notification:received', {
            title: payload.title,
            message: payload.message,
            type: payload.type,
            createdAt: new Date()
        });
    } catch (error) {
        console.error("Failed to send notification", error);
    }
};