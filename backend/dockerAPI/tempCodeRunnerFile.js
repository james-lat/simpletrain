const express = require('express');
const app = express();
const port = 3001;
const Docker = require('dockerode');

// Configuration for connecting to the remote Docker daemon
const docker = new Docker({ host: '192.168.40.162', port: 2375 }); // Replace with your VM's IP

app.post('/create-container', async (req, res) => {
    const containerName = `my-test-container-${Date.now()}`; // Unique name

    const containerOptions = {
        Image: 'nginx',
        name: containerName,
        ExposedPorts: { '80/tcp': {} }, // If you need to expose ports
        HostConfig: {
            PortBindings: {
                '80/tcp': [{ HostPort: '8081' }] // Map VM port 8081 to container port 80
            }
        }
    };

    try {
        try {
            await docker.getImage(containerOptions.Image).inspect();
            console.log(`Image ${containerOptions.Image} found locally.`);
        } catch (getImageError) {
            console.log(`Image ${containerOptions.Image} not found locally. Pulling...`);
            await docker.pull(containerOptions.Image);
            console.log(`Image ${containerOptions.Image} pulled successfully.`);
        }

        const existingContainers = await docker.listContainers({ all: true, filters: { name: [containerName] } });
        if (existingContainers.length > 0) {
            return res.status(409).send(`Container with name ${containerName} already exists.`);
        }

        const container = await docker.createContainer(containerOptions);
        await container.start();

        res.status(201).send(`Container ${containerName} created and started with ID: ${container.id}`);
    } catch (error) {
        console.error('Error creating container:', error);
        res.status(500).send(`Error creating container: ${error.message}`);
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});