import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
    io = new Server(server);

    io.on("connection", (socket) => {
        console.log("connected");
    });
};

export const getIO = () => io;
