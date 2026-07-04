import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import onlineUsers from "./onlineUsers.js";
import { handlePresence } from "./Handlers/presence.handler.js";

let io: Server;

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
        },
    });

    // Authentication middleware for Socket.io
    io.use((socket, next) => {
        try {
            let token = socket.handshake.auth?.token;

            // Fallback to headers or query params
            if (!token && socket.handshake.headers?.authorization) {
                const authHeader = socket.handshake.headers.authorization;
                if (authHeader.startsWith("Bearer ")) {
                    token = authHeader.split(" ")[1];
                } else {
                    token = authHeader.trim();
                }
            }

            if (!token && socket.handshake.query?.token) {
                token = socket.handshake.query.token as string;
            }

            if (!token) {
                return next(new Error("Authentication error: No token provided"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };
            (socket as any).user = decoded;
            next();
        } catch (error) {
            return next(new Error("Authentication error: Invalid or expired token"));
        }
    });

    io.on("connection", (socket) => {
        const userId = (socket as any).user?.userId;
        if (userId) {
            onlineUsers.set(userId, socket.id);
            console.log(`User ${userId} connected with socket ${socket.id}`);
            
            // Register presence handlers
            handlePresence(socket, io);
        }

        socket.on("disconnect", () => {
            if (userId) {
                onlineUsers.delete(userId);
                console.log(`User ${userId} disconnected`);
            }
        });
    });
};

export const getIO = () => io;
export { onlineUsers };
