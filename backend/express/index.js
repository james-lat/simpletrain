// index.mjs
import express from 'express';
import jobRoutes from '../routes/jobs.mjs';
import { initializeK8sClient } from '../kubernetes/client.mjs';

const app = express();
const port = 3001;

app.use(express.json());
app.use('/api/jobs', jobRoutes);

async function startServer() {
    try {
        await initializeK8sClient(); // VERY IMPORTANT: Await the initialization
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1); // Exit the process if initialization fails
    }
}

startServer();