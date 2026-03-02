// ============================================================
// App.js — Composant racine
// ============================================================

// 🔑 CHANGEMENT CLÉ : On n'exporte PLUS le socket depuis ici.
// Le socket est maintenant géré par SocketContext.js
// et accessible via le hook useSocket() dans chaque composant.
// Cela évite le bug du "singleton de module" qui faisait que
// deux onglets partageaient le même socket.

import React, { useState } from "react";
import Join from "./components/Join";
import Chat from "./components/Chat";
import "./App.css";

function App() {
    const [username, setUsername] = useState("");
    const [room, setRoom]         = useState("");
    const [connected, setConnected] = useState(false);

    return (
        <div className="App">
            {!connected ? (
                <Join
                    username={username}
                    setUsername={setUsername}
                    room={room}
                    setRoom={setRoom}
                    setConnected={setConnected}
                />
            ) : (
                <Chat username={username} room={room} />
            )}
        </div>
    );
}

export default App;
