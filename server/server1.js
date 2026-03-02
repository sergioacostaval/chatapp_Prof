// server.js
const express = require("express");
const http    = require("http");
const cors    = require("cors");
const { Server } = require("socket.io");
const os = require("os");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// ─── Socket.io ──────────────────────────────
// CORS configuré pour PC (localhost) + réseau local (IP du PC)
const io = new Server(server, {
    cors: {
        origin: "*",  // accepte toutes les origines
        methods: ["GET", "POST"],
    },
});

// ─── Rooms prédéfinies ───────────────────────
const rooms = {
    "Generale":  { users: [] },
    "Codding":   { users: [] },
    "Support":    { users: [] },
    "Entraide":  { users: [] },
};

// ─── Route REST : récupérer la liste des rooms ───
app.get("/rooms", (req, res) => {
    const list = Object.entries(rooms).map(([name, data]) => ({
        name,
        count: data.users.length,
    }));
    res.json(list);
});

// ─── Socket.io events ────────────────────────
io.on("connection", (socket) => {
    console.log(`✅ Connecté : ${socket.id}`);

    // Envoyer la liste des rooms dès la connexion
    socket.emit("rooms_list", getRoomsList());

    // ── Rejoindre une room ──────────────────
    socket.on("join_room", ({ username, room }) => {
        if (!rooms[room]) rooms[room] = { users: [] };

        socket.join(room);
        socket.currentRoom = room;
        socket.currentUsername = username;

        if (!rooms[room].users.find(u => u.socketId === socket.id)) {
            rooms[room].users.push({ socketId: socket.id, username });
        }

        console.log(`👤 ${username} → room "${room}" (${rooms[room].users.length} participants)`);

        io.to(room).emit("receive_message", {
            author: "Système",
            message: `${username} a rejoint la room 💬`,
            time: now(),
            system: true,
        });

        io.to(room).emit("room_users", rooms[room].users);
        io.emit("rooms_list", getRoomsList());
    });

    // ── Créer une nouvelle room ─────────────
    socket.on("create_room", ({ roomName }) => {
        const name = roomName.trim();
        if (!name || rooms[name]) return;
        rooms[name] = { users: [] };
        console.log(`🆕 Room créée : "${name}"`);
        io.emit("rooms_list", getRoomsList());
    });

    // ── Envoyer un message ──────────────────
    socket.on("send_message", (data) => {
        console.log(`💬 "${data.author}" → "${data.room}": ${data.message}`);
        io.to(data.room).emit("receive_message", data);
    });

    // ── Déconnexion ─────────────────────────
    socket.on("disconnect", () => {
        const room = socket.currentRoom;
        const username = socket.currentUsername;
        if (!room || !rooms[room]) return;

        rooms[room].users = rooms[room].users.filter(u => u.socketId !== socket.id);
        console.log(`❌ ${username} a quitté "${room}"`);

        io.to(room).emit("receive_message", {
            author: "Système",
            message: `${username} a quitté la room 👋`,
            time: now(),
            system: true,
        });
        io.to(room).emit("room_users", rooms[room].users);
        io.emit("rooms_list", getRoomsList());
    });
});

// ─── Helpers ───────────────────────────────
function now() {
    return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function getRoomsList() {
    return Object.entries(rooms).map(([name, data]) => ({
        name,
        count: data.users.length,
    }));
}

// ─── Fonction pour récupérer l'IP locale ───
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (let iface of Object.values(interfaces)) {
        for (let alias of iface) {
            if (alias.family === "IPv4" && !alias.internal) return alias.address;
        }
    }
    return "localhost";
}

// ─── Démarrage serveur ────────────────────
const PORT = 5000;
const localIP = getLocalIP();
server.listen(PORT, () => console.log(`🚀 Serveur sur http://${localIP}:${PORT}`));