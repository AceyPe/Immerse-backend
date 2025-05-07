import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // adjust to your Unity client or frontend origin
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        // Join a session room
        socket.on("join_session", (sessionId) => {
            socket.join(`session_${sessionId}`);
            console.log(`Socket ${socket.id} joined session ${sessionId}`);
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });

    return io;
};

export { io };
