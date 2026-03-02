// ============================================================
// Join.js — Écran de connexion avec liste des rooms en temps réel
// ============================================================
import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";

function Join({ username, setUsername, room, setRoom, setConnected }) {
    const socket = useSocket();

    // Liste des rooms reçue du serveur en temps réel
    const [roomsList, setRoomsList] = useState([]);
    // Champ pour créer une nouvelle room
    const [newRoomName, setNewRoomName] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [connectionError, setConnectionError] = useState("");

    // ── Écouter la liste des rooms en temps réel ──────────────
    // Le serveur envoie "rooms_list" à chaque connexion/déconnexion
    useEffect(() => {
        const handleRoomsList = (list) => {
            setRoomsList(list);
            setConnectionError("");
        };
        const handleConnectError = (err) => {
            setConnectionError(err?.message || "Connexion au serveur impossible.");
        };

        // Se connecter au serveur pour recevoir la liste
        if (!socket.connected) {
            socket.connect();
        }

        socket.on("rooms_list", handleRoomsList);
        socket.on("connect_error", handleConnectError);

        return () => {
            socket.off("rooms_list", handleRoomsList);
            socket.off("connect_error", handleConnectError);
        };
    }, [socket]);

    // ── Rejoindre une room ────────────────────────────────────
    const joinRoom = (selectedRoom) => {
        const roomToJoin = selectedRoom || room;
        if (!username.trim() || !roomToJoin.trim()) return;

        const doJoin = () => {
            socket.emit("join_room", {
                username: username.trim(),
                room:     roomToJoin.trim(),
            });
            setRoom(roomToJoin.trim());
            setTimeout(() => setConnected(true), 80);
        };

        if (socket.connected) {
            doJoin();
        } else {
            socket.once("connect", doJoin);
            socket.connect();
        }
    };

    // ── Créer une nouvelle room ───────────────────────────────
    const createRoom = () => {
        if (!newRoomName.trim()) return;
        socket.emit("create_room", { roomName: newRoomName.trim() });
        setNewRoomName("");
        setShowCreate(false);
    };

    return (
        <div className="joinWrapper">
            <div className="joinContainer">

                {/* Logo */}
                <div className="joinLogo">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="44" height="44">
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.118 1.522 5.851L0 24l6.293-1.499A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.145 16.747c-.264.742-1.305 1.358-2.14 1.538-.57.122-1.315.22-3.822-.821-3.21-1.319-5.278-4.578-5.44-4.788-.155-.21-1.3-1.729-1.3-3.298 0-1.569.817-2.34 1.107-2.662.264-.289.578-.362.77-.362.19 0 .383.002.55.01.177.009.414-.067.648.494.243.578.824 2.008.895 2.153.072.145.12.314.024.504-.09.186-.135.3-.264.465-.13.165-.274.368-.39.494-.13.14-.266.291-.114.57.15.278.67 1.105 1.44 1.79 1 .895 1.838 1.174 2.115 1.304.278.13.44.108.603-.065.165-.173.695-.812.88-1.09.186-.278.37-.232.624-.14.254.093 1.614.761 1.89.9.278.138.463.208.531.324.067.116.067.672-.196 1.42z"/>
                    </svg>
                </div>

                <h2>ChatApp</h2>
                <p className="joinSubtitle">Entrez votre pseudo puis choisissez une room</p>

                {/* Champ pseudo */}
                <div className="inputGroup">
                    <label>Pseudo</label>
                    <input
                        type="text"
                        placeholder="Votre nom..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength={20}
                        autoFocus
                    />
                </div>

                {/* ── Liste des rooms ── */}
                <div className="roomsSection">
                    <div className="roomsSectionHeader">
                        <label>Choisir une room</label>
                        <button
                            className="createRoomToggle"
                            onClick={() => setShowCreate(!showCreate)}
                            title="Créer une nouvelle room"
                        >
                            {showCreate ? "✕ Annuler" : "+ Nouvelle room"}
                        </button>
                    </div>

                    {/* Formulaire création de room */}
                    {showCreate && (
                        <div className="createRoomForm">
                            <input
                                type="text"
                                placeholder="Nom de la nouvelle room..."
                                value={newRoomName}
                                onChange={(e) => setNewRoomName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && createRoom()}
                                maxLength={30}
                            />
                            <button onClick={createRoom} disabled={!newRoomName.trim()}>
                                Créer
                            </button>
                        </div>
                    )}

                    {/* Grille des rooms disponibles */}
                    <div className="roomsGrid">
                        {roomsList.length === 0 ? (
                            <p className="loadingRooms">
                                {connectionError || "Chargement des rooms..."}
                            </p>
                        ) : (
                            roomsList.map((r) => (
                                <button
                                    key={r.name}
                                    className={`roomCard ${room === r.name ? "selected" : ""}`}
                                    onClick={() => {
                                        if (!username.trim()) {
                                            // Sélectionner sans rejoindre si pas de pseudo
                                            setRoom(r.name);
                                        } else {
                                            joinRoom(r.name);
                                        }
                                    }}
                                >
                                    <span className="roomCardAvatar">
                                        {r.name.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="roomCardName">#{r.name}</span>
                                    <span className="roomCardCount">
                                        {r.count > 0
                                            ? `${r.count} 🟢`
                                            : "vide"}
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Bouton rejoindre (si une room est sélectionnée sans avoir cliqué dessus) */}
                {room && username && (
                    <button className="joinBtn" onClick={() => joinRoom(room)}>
                        Rejoindre #{room} →
                    </button>
                )}

            </div>
        </div>
    );
}

export default Join;
