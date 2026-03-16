// ============================================================
// Sidebar.js — Panneau latéral avec la liste des utilisateurs
// ============================================================

import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

function Sidebar({ users, room, show, onClose }) {
    // Bloc pour prendre le socket
    const socket = useSocket();

    // Bloc pour stocker activite
    const [activityLog, setActivityLog] = useState([]);

    // Bloc pour ecouter activite
    useEffect(() => {
        if (!socket) return;

        const handleActivityLog = (event) => {
            setActivityLog((prev) => [event, ...prev].slice(0, 5));
        };

        const handleActivityHistory = (history) => {
            setActivityLog(history);
        };

        socket.on("activity_log", handleActivityLog);
        socket.on("activity_history", handleActivityHistory);

        return () => {
            socket.off("activity_log", handleActivityLog);
            socket.off("activity_history", handleActivityHistory);
        };
    }, [socket]);

    return (
        <>
            {/* Fond semi-transparent quand la sidebar est ouverte (mobile) */}
            {show && <div className="sidebarOverlay" onClick={onClose} />}

            <div className={`sidebar ${show ? "open" : ""}`}>
                <div className="sidebarHeader">
                    <h4>#{room}</h4>
                    <button className="closeSidebar" onClick={onClose}>✕</button>
                </div>

                <div className="sidebarSection">
                    <p className="sidebarLabel">
                        PARTICIPANTS ({users.length})
                    </p>

                    {/* 🔹 Afficher chaque utilisateur avec son initiale */}
                    {users.length > 0 ? (
                        users.map((u) => (
                            <div className="userItem" key={u.socketId}>
                                <div className="userAvatar">
                                    {u.username.charAt(0).toUpperCase()}
                                </div>
                                <span>{u.username}</span>
                                {/* Point vert = en ligne */}
                                <span className="onlineDot" />
                            </div>
                        ))
                    ) : (
                        <p className="noUsers">Aucun utilisateur</p>
                    )}
                </div>

                {/* Bloc pour afficher activite */}
                <div className="sidebarSection">
                    <p className="sidebarLabel">ACTIVITE RECENTE</p>

                    {activityLog.length > 0 ? (
                        activityLog.map((item, index) => (
                            <div className="activityItem" key={index}>
                                {item.username} {item.action} #{item.room} a {item.time}
                            </div>
                        ))
                    ) : (
                        <p className="noUsers">Aucune activite</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Sidebar;