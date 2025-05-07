import express from 'express';
import dotenv from 'dotenv';
import sensorsRoutes from './routes/sensorsRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import formRoutes from './routes/formRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createTables } from './config/dbSetup.js';
import { Server } from 'socket.io';
import http from 'http';
import { initSocket } from './websocket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || '2226';

// Middleware
app.use(cors({
  origin: 'http://localhost:2225',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// intiate socket
initSocket(server);

// define routes
app.use('/api', sensorsRoutes);
app.use('/api', sessionRoutes);
app.use('/api', userRoutes);
app.use('/api', formRoutes);
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the CalmaVR API!");
});

await createTables().then(() => {
    console.log('Database Setup Complete!')

    // Start the server
    app.listen(PORT, () => {
    
        console.log(`server running on http://localhost:${PORT}`);
    
    });
}).catch(err => {
    console.log('Error during database setup:', err);
})