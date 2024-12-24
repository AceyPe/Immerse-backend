import express from 'express';
import dotenv from 'dotenv'
import { pool } from './config/db.js';

dotenv.config();

const app = express();
const PORT = '3001';
const db = pool
let datas = []

// Middleware
app.use(express.json());

app.get('/api/data/:patientId', async (req, res) => {
    try {
        const queryResult = await db.query('SELECT * FROM your_table');
        res.json(queryResult.rows);
    } catch (err) {
        handleError(err);
        res.status(500).send('Database error'); // Handle database issues gracefully
    }
});
app.post("/sensors", async (req, res) => {
    try {
        const { oxygen, heartbeat, temprature } = req.body;

        if (!oxygen || !heartbeat || !temprature) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        // const result = await db.query(
        //     "INSERT INTO sensor_readings (patient_id, oxygen, heartbeat, timestamp) VALUES ($1, $2, $3, NOW()) RETURNING *",
        //     [patientId, oxygen, heartbeat]
        // );

        // broadcast data to websocket clients
        const data = result.rows[0];
        datas.append(data);
        // broadcast(data);

        res.status(201).json({ message: "Data recieved and broadcasted.", data });
    } catch (error) {
        console.error("Error inserting sensor data:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.get("/", (req, res) => {
    res.send("test");
})

app.get("/sensors", (req, res) => {
    res.send(datas);c
})

// Start the server
app.listen(PORT, () => {

    console.log(`server running on http://localhost:${PORT}`);

});