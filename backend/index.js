import express from 'express'; // Import Express.js
import jobsRoutes from './routes/jobs.mjs'; // Import job routes

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json()); // Enable JSON body parsing

// Mount routes
app.use('/api/jobs', jobsRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
