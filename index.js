/**
 * #solid-talk
 *
 * @author Afaan Bilal https://afaan.dev
 * @link   https://afaan.dev/solid-talk
 */

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get("/", (req, res) => res.send("#solid-talk @ afaan.dev/solid-talk"));

let users = [];

io.on("connection", socket => {
    const user = { id: socket.id, name: "", avatar: "" };
    users.push(user);

    io.emit("users", users);

    socket.on("disconnect", () => {
        users = users.filter(o => o.id !== user.id);
        io.emit("users", users);
    });

    socket.on("message", m => io.emit("message", m));
    socket.on("user-updated", m => {
        users[users.findIndex(o => o.id === m.id)] = m;
        io.emit("users", users);
    });
});

server.listen(8080, () => console.log("Server started on :8080"));
