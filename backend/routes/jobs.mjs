import express from 'express';
import { createTrainingDeployment, deleteTrainingDeployment, getDeploymentLogs, listDeployments } from '../kubernetes/client.mjs';
const router = express.Router();
// Create a training job
router.post('/', async (req, res) => {
    try {
        // Extracts: deploymentName, imageName, command, resources, ports from req.body
        // Calls: k8sClient.createTrainingDeployment()
        // Returns: 201 Created on success, 500 Internal Server Error on failure
    } catch (error) {
        console.error("error creating training job", error)
        res.status(500).json({ message: 'Failed to create training job', error: error.message });
    }
});

// Delete a training job
router.delete('/:deploymentName', async (req, res) => {
    try {
        // Extracts: deploymentName from req.params
        // Calls: k8sClient.deleteTrainingDeployment()
        const deploymentName = req.params.deploymentName; 
        console.log(`Deleting deployment: ${deploymentName}`);
        const Logs = await deleteTrainingDeployment(deploymentName); 
        res.status(200).json("Successfully deleted Deployment:" + deploymentName)
       console.log("Successfully deleted Deployment:" + deploymentName)
      
        // Returns: 200 OK on success, 500 Internal Server Error on failure
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete training job', error: error.message });
    }
});

// Get logs from a training job
router.get('/:deploymentName/logs', async (req, res) => {
    try {
        // Extracts: deploymentName from req.params
        // Calls: k8sClient.getDeploymentLogs()
        const deploymentName = req.params.deploymentName; 
        console.log(`Getting logs for deployment: ${deploymentName}`);
        const Logs = await getDeploymentLogs(deploymentName); 
        res.status(200).json("logs:" + Logs)
        res.send("deployment logs:" + Logs); 
        console.log("deployment logs:" + Logs)
        // Returns: 200 OK with logs on success, 500 Internal Server Error on failure
    } catch (error) {
        res.status(500).json({message: "Failed to get logs", error: error.message})
    }
})

// Get all training jobs
router.get('/', async (req, res) => {
    try {
        // Calls: k8sClient.listDeployments()
        console.log("Getting all deployments...")
        allDeployments = await listDeployments();
        res.status(200).json({ deployments: allDeployments });
        console.log("Deployments: " + allDeployments);
        // Returns: 200 OK with all deployments on success, 500 Internal Server Error on failure
    } catch (error) {
        res.status(500).json({message: "Failed to get deployments", error: error.message})
    }
})

export default router;