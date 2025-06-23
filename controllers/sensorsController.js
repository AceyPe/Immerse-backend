
import fs from 'fs';
import path from 'path';
import { io } from '../websocket.js';
import { pool } from '../config/db.js';
import { activeSessions } from './sessionController.js';

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



const dataDir = path.resolve('sensor-data'); // Make sure this exists

export const postSensorData = async (req, res) => {
    try {
        const therapistId = req.params.therapistId;
        const sessionId = activeSessions.get(therapistId);
        const { oxygen, heartbeat, temperature, gsr } = req.body;
        
        if (!oxygen || !heartbeat || !temperature || !gsr) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        if (!sessionId) {
            return res.status(400).json({ error: "No active session for this therapist" });
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

        // Real-time broadcast
        io.to(`session_${sessionId}`).emit("new_sensor_data", data);

        // Save to file (append to disk)
        const filePath = path.join(dataDir, `session_${sessionId}.jsonl`); // line-delimited JSON
        fs.appendFile(filePath, JSON.stringify(data) + '\n', err => {
            if (err) console.error("Failed to write sensor data:", err);
        });

        res.status(201).json({ message: "Data received", data });

    } catch (error) {
        console.error("Sensor error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
