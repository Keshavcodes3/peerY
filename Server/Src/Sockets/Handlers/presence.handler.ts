import type { Socket, Server } from "socket.io";
import onlineUsers from "../onlineUsers.js";

/**
 * Handles presence related socket events.
 */
export const handlePresence = (socket: Socket, io: Server) => {
    const userId = (socket as any).user?.userId;
    if (!userId) return;

    // Broadcast that user is online
    socket.broadcast.emit("user:online", { userId });

    // Handle manual check if a user is online
    socket.on("presence:check", (targetUserId: string, callback: (isOnline: boolean) => void) => {
        const isOnline = onlineUsers.has(targetUserId);
        if (typeof callback === "function") {
            callback(isOnline);
        }
    });
};
