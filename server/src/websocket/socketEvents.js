import { handleConnection, handleSendMessage } from "./socketHandlers.js";

export async function setupSocketEvents(io) {
    io.on("connection", (socket) => {
        handleConnection(socket);

        socket.on("send_message", (messageContent) => {
            handleSendMessage(io, {messageContent});
        });
    });
}