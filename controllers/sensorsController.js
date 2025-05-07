let datas = []; // Temporary buffer

import { pool } from '../config/db.js';
import { io } from '../websocket.js'; // Your socket.io instance

const db = pool;

// Send current in-memory sensor data (can filter later)
export const getSensorData = async (req, res) => {
    const { sessionId } = req.query;
    if (sessionId) {
        const filtered = datas.filter(d => d.sessionId == sessionId);
        return res.status(200).json({ data: filtered });
    }
    res.status(200).json({ data: datas });
};

// Receive data from ESP32
export const postSensorData = async (req, res) => {
    try {
        const therapistId = parseInt(req.params.therapistId);
        const { sessionId = null, oxygen, heartbeat, temperature, gsr } = req.body;

        if (!oxygen || !heartbeat || !temperature || !gsr) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const data = {
            therapistId,
            sessionId,
            oxygen,
            heartbeat,
            temperature,
            GSR: gsr,
            timestamp: new Date().toISOString(),
        };

        datas.push(data);

        // Broadcast only if sessionId is assigned
        if (sessionId) {
            io.to(`session_${sessionId}`).emit("new_sensor_data", data);
        }

        res.status(201).json({ message: "Data received", data });

    } catch (error) {
        console.error("Sensor error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Optional: Assign existing buffered data to a session
export const assignBufferedDataToSession = (therapistId, sessionId) => {
    datas.forEach(d => {
        if (d.therapistId === therapistId && !d.sessionId) {
            d.sessionId = sessionId;
        }
    });
};
