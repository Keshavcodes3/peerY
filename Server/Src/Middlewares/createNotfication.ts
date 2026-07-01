interface NotificationPayload {
    recipientId: string;
    title: string;
    message: string;
    type: 'NEW_LIKE' | 'MUTUAL_MATCH' | 'MATCH_ACCEPTED' | 'UNMATCHED';
}

export const sendNotification = async (payload: NotificationPayload) => {
    try {
        // TODO: Replace with actual DB insertion with socket.io or firebase
        console.log(`[Notification to ${payload.recipientId}]: ${payload.title} - ${payload.message}`);


    } catch (error) {
        console.error("Failed to send notification", error);
    }
};