import { getIO } from "../index.js";
import onlineUsers from "../onlineUsers.js";

/**
 * Utility to send a real-time notification to a specific user.
 * Looks up the user's active socket ID from the onlineUsers map.
 * 
 * @returns {boolean} True if the user is online and the event was emitted, false otherwise.
 */
export const sendNotificationToUser = (userId: string, event: string, data: any): boolean => {
    const socketId = onlineUsers.get(userId);
    if (!socketId) return false;

    const io = getIO();
    if (!io) return false;

    io.to(socketId).emit(event, data);
    return true;
};
