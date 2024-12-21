const express = require('express');
const app = express();
const port = 3001;
const Docker = require('dockerode');


const docker = new Docker({ socketPath: '\\\\.\\pipe\\docker_engine' }); // Use named pipe on Windows



app.post('/create-container', async (req, res) => {
    const containerName = `simple-train-${Date.now()}`; // Unique name

    const containerOptions = {
        Image: 'docker/welcome-to-docker', // Use a valid image!
        name: containerName,
        ExposedPorts: { '80/tcp': {} },
        HostConfig: {
            PortBindings: {
                '80/tcp': [{ HostPort: '8081' }] // Changed to 8081 to avoid conflicts
            },
        },
        Env: [
            'MY_ENV_VAR=my_value'
        ],
    };

    try {
        // Check if the image exists locally. If not, pull it.
        try {
            await docker.getImage(containerOptions.Image).inspect();
            console.log(`Image ${containerOptions.Image} found locally.`);
        } catch (getImageError) {
            console.log(`Image ${containerOptions.Image} not found locally. Pulling...`);
            await docker.pull(containerOptions.Image);
            console.log(`Image ${containerOptions.Image} pulled successfully.`);
        }

        // Check for existing containers with the same name.
        const existingContainers = await docker.listContainers({ all: true, filters: { name: [containerName] } });
        if (existingContainers.length > 0) {
            return res.status(409).send(`Container with name ${containerName} already exists.`);
        }

        console.log("Creating container..."); // Log before creation
        const container = await docker.createContainer(containerOptions);
        console.log(`Sent request to create container with ID: ${container.id}`);
        console.log(`Container ${container.id} created.`);

        console.log("Starting container..."); // Log before starting
        await container.start();
        console.log(`Container ${container.id} started.`);

        console.log("Inspecting container...");
        const inspectData = await container.inspect();
        console.log("Container inspect data:", JSON.stringify(inspectData, null, 2));

        res.status(201).send(`Container ${container.id} created and started.`);
    } catch (error) {
        console.error('Error creating or starting container:', error);
        res.status(500).send(`Error creating container: ${error.message}`);
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log('listening on port ' + port);
});