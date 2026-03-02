// ============================================================
// Chat.js — Composant principal du chat (style WhatsApp)
// ============================================================

import React, { useState, useEffect, useRef } from "react";
// 🔑 useSocket() au lieu de l'import direct depuis App.js
import { useSocket } from "../context/SocketContext";
import Message from "./Message";
import Sidebar from "./Sidebar";

function Chat({ username, room }) {
    // 🔹 Récupération du socket via le Context
    const socket = useSocket();
    // 🔹 État local : liste des messages et contenu du champ de saisie
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);

    // 🔹 Référence pour scroller automatiquement vers le bas
    const messagesEndRef = useRef(null);

    // ----------------------------------------------------------
    // useEffect : Abonnement aux événements Socket.io
    // ----------------------------------------------------------
    useEffect(() => {
        const handleReceiveMessage = (messageData) => {
            setMessages((prev) => [...prev, messageData]);
        };
        const handleRoomUsers = (updatedUsers) => {
            setUsers(updatedUsers);
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("room_users", handleRoomUsers);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("room_users", handleRoomUsers);
        };
    }, [socket]); // 🔹 socket dans les dépendances car il vient du Context

    // ----------------------------------------------------------
    // useEffect : Scroll automatique vers le dernier message
    // ----------------------------------------------------------
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ----------------------------------------------------------
    // Envoyer un message
    // ----------------------------------------------------------
    const sendMessage = () => {
        // 🔹 Ne pas envoyer si le champ est vide
        if (!currentMessage.trim()) return;

        // 🔹 Construire l'objet message
        const messageData = {
            room,           // La room destinataire
            author: username,
            message: currentMessage.trim(),
            time: new Date().toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        // 🔹 Envoyer au serveur via Socket.io
        // Le serveur se chargera de rediffuser à tous les membres de la room
        socket.emit("send_message", messageData);

        // 🔹 Vider le champ de saisie
        setCurrentMessage("");
    };

    // 🔹 Envoyer avec la touche Entrée (Shift+Entrée = nouvelle ligne)
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chatWrapper">
            {/* ---- SIDEBAR (liste des utilisateurs) ---- */}
            <Sidebar
                users={users}
                room={room}
                show={showSidebar}
                onClose={() => setShowSidebar(false)}
            />

            {/* ---- ZONE PRINCIPALE ---- */}
            <div className="chatMain">

                {/* En-tête style WhatsApp */}
                <div className="chatHeader">
                    <button
                        className="sidebarToggle"
                        onClick={() => setShowSidebar(!showSidebar)}
                        title="Voir les participants"
                    >
                        <span></span><span></span><span></span>
                    </button>
                    <div className="chatHeaderInfo">
                        <div className="chatHeaderAvatar">
                            {room.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3>#{room}</h3>
                            <p>{users.length} participant{users.length > 1 ? "s" : ""}</p>
                        </div>
                    </div>
                </div>

                {/* Zone des messages */}
                <div className="messagesArea">
                    {messages.length === 0 && (
                        <div className="emptyChat">
                            <p>Aucun message pour l'instant.<br />Soyez le premier à écrire ! 👋</p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <Message key={index} msg={msg} username={username} />
                    ))}

                    {/* Élément invisible en bas pour le scroll automatique */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Zone de saisie */}
                <div className="inputArea">
                    <input
                        type="text"
                        placeholder="Écrire un message..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        maxLength={500}
                    />
                    <button
                        className="sendBtn"
                        onClick={sendMessage}
                        disabled={!currentMessage.trim()}
                        title="Envoyer"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;
