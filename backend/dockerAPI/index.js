const express = require('express');
const app = express();
const port = 3001;
const Docker = require('dockerode');
const fs = require('fs');
const requirements = require('./config.json');
// Configuration for connecting to the remote Docker daemon
const ca = fs.readFileSync(requirements.caPath);
const cert = fs.readFileSync(requirements.certPath);
const key = fs.readFileSync(requirements.keyPath);
const serverIp = requirements.serverIp;
const serverPort = requirements.portMappings[0].hostPort;

const docker = new Docker(
  {
     host: serverIp, 
     port: serverPort,
     ca: ca,
     cert: cert,
     key: key,
     protocol: 'https',
    }
); 

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/create-container', async (req, res) => {
  const containerName = `simple-train-container-${Date.now()}`;

  const containerOptions = {
    Image: requirements.imageName,
    name: containerName,
    cmd: requirements.commandLineArgs,
  };
  console.log(requirements.imageName); 
 pullImage(requirements.imageName)
    .then(() => {
        console.log(`Image ${requirements.imageName} pulled successfully on remote host.`);
        return pullContainer(containerOptions);
    })
    .then((response) => { // Handle response from pullContainer
      res.status(response.status).send(response.message);
    })
    .then(() => { // Get container logs
      const container = docker.getContainer(containerName);
      getContainerLogs(container);
    })
    .catch((error) => { // Handle errors from either function
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

async function pullImage(imageName) { 
  try { 
    const images = await docker.listImages({ filters: { reference: [imageName] } });
    if (images.length > 0) { 
      console.log("Image already exists on remote host.");
      return; 
    } else { 
      console.log(`Image ${imageName} not found on remote host. Pulling image...`);
      const pullStream = await docker.pull(imageName);
      return await new Promise((resolve, reject) => {
        docker.modem.followProgress(pullStream, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
    }
  } catch (error) {
    console.error("Error checking or pulling image:", error);
    throw error; 
  }
}

async function pullContainer(containerOptions) { 
  console.log("Here are the container options:", containerOptions);
  try {
    const existingContainers = await docker.listContainers({ all: true, filters: { name: [containerOptions.name.toString()] } });
    if (existingContainers.length > 0) {
        return {message: `Container with name ${containerOptions.name.toString()} already exists.`};
    }

    const container = await docker.createContainer(containerOptions);
    await container.start();
    return { status: 201, message: `Container ${containerOptions.name} created and started with ID: ${container.id}` };
  } catch (error) {
        console.error('Error creating container:', error);
        return { status: 500, message: `Error creating container: ${error.message}` };
  }
}


async function getContainerLogs(container) {
  try {
    const logStream = await container.logs({
      follow: true,
      stdout: true, 
      stderr: true, 
      timestamps: true,
    });

    logStream.on('data', (chunk) => {
      console.log(chunk.toString()); // Process each log chunk
      
    });

    logStream.on('error', (err) => {
      console.error('Error getting container logs:', err);
    
    });

    logStream.on('end', () => {
      console.log('Log stream ended.');
     
    });
  } catch (error) {
    console.error("Error getting container logs:", error);
    // Handle the error
  }
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});