const express = require('express');
const app = express();
const port = 3001;
const Docker = require('dockerode');
const requirements = require('./requirements.json');
// Configuration for connecting to the remote Docker daemon
const docker = new Docker({ host: '192.168.40.162', port: 2375 }); 

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/create-container', async (req, res) => {
  const containerName = `simple-train-container-${Date.now()}`;

  const containerOptions = {
    Image: requirements.imageName,
    name: containerName,
    Cmd: commandLineArgs
    
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
    .catch((error) => { // Handle errors from either function
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

async function pullImage(imageName) { 
  const pullStream = await docker.pull(imageName);
  return await new Promise((resolve, reject) => {
    docker.modem.followProgress(pullStream, (err, res) => {
        if (err) return reject(err);
        resolve(res);
    });
});
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


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});