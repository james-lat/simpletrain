# GPU Training Service (Development README)

--
Todo

## Running the Login Page for the CLI

Follow these steps to start the login page:

1. **Navigate to the directory:**
   ```bash
   cd simpletrain/cli

2. **Navigate to this directory in a second terminal:**
   ```bash
   cd simpletrain/backend

3. **In that same terminal enter:**
   ```bash
   DJANGO_SETTINGS_MODULE=auth.settings daphne -e ssl:8443:privateKey=key.pem:certKey=cert.pem auth.asgi:application --verbosity 2

4. **In the CLI terminal enter:**
   ```bash
   node cli.js login
   

This document is intended for the development team and focuses on the architecture, current state, and next steps for the GPU Training Service project.

**Project Goal:** Provide a secure and scalable service for researchers to run training jobs on GPU clusters.

---

## Current Status (Phase 1 - Core Kubernetes Interaction and Backend Setup):

The backend component is the current focus, alongside foundational work on Django for authentication and data modeling. This phase implements:

### Kubernetes Interaction:
* **Job Creation:** Creates Kubernetes Deployments, Services, and Ingresses.
* **Job Deletion:** Deletes Deployments, Services, and Ingresses.
* **Log Retrieval:** Retrieves logs from training Pods.
* **Job Listing:** Lists existing Deployments.

### Django Integration:
* **User Authentication:** Initial implementation of user registration and login using Django's built-in authentication.
* **Data Models:** Introduce initial models for users, organizations, and Docker container presets. For example:
  - A **Class Object** to represent Docker containers.
  - Organizations with attributes that store possible Docker presets.

### Express and Docker Integration:
* Develop Express routes for interacting with Kubernetes and Docker.
* Containerize both the backend and training images using Docker.

---

## Architecture (Centralized Backend)

### Technology Stack:
* **Backend:** Node.js, Express.js
* **Kubernetes Interaction:** `@kubernetes/client-node`
* **Authentication and Data Modeling:** Django (using its built-in database for now)
* **Containerization:** Docker (for backend and training images)
* **CLI:** JavaScript (Commander.js, readline, chalk, axios)

---

## File Structure:
## File Structure

| File/Folder | Description |
|---|---|
| `backend/` | Contains the backend code. |
| `backend/express` | Contains the express server code. |
| `backend/express/index.js` | The main entry point for the Express.js server. This file: <br> - Initializes the Express app. <br> - Sets up middleware (e.g., JSON parsing, CORS). <br> - Defines and mounts API routes. <br> - Starts the server and listens for incoming requests. |
| `backend/kubernetes/` | Contains Kubernetes-related code. |
| `backend/kubernetes/client.mjs` | Contains the logic for interacting with the Kubernetes API using `@kubernetes/client-node`. This module defines functions to: <br> - Create Deployments, Services, and Ingresses based on dynamic configurations received from API requests. <br> - Delete Deployments, Services, and Ingresses. <br> - Retrieve logs from Pods. <br> - List Deployments and other Kubernetes resources. |
| `backend/routes/` | Contains API route definitions. |
| `backend/routes/jobs.mjs` | Defines API routes for managing training jobs: <br> - `POST /api/jobs`: Creates a new training job (Deployment, Service, Ingress). <br> - `DELETE /api/jobs/:deploymentName`: Deletes a training job. <br> - `GET /api/jobs/:deploymentName/logs`: Retrieves logs for a training job. |
| `backend/middleware/` | Contains middleware functions. |
| `backend/middleware/auth.js` | Authentication middleware that verifies JWT tokens issued by the Django authentication system. |
| `backend/auth` | Contains django authentication files |     
| `backend/login` | Contains login files | 
| `backend/.env` | Contains environment variables for the backend (e.g., port, Django URL, etc.). |
| `backend/manage.py` | to be filled out |
| `cli/` | contains the command line interface functions |
| `cli/cli.js` | to be filled out |
| `frontend/` (Optional) | Contains the frontend code |
| `README.md` | The project's README file (this file). |
---

## Backend Implementation Details:

### **Node.js Backend:**
* **`index.js`:** Sets up the Express app, mounts routes, and handles basic error handling.
* **`routes/jobs.js`:** Defines API endpoints for managing training jobs (create, delete, get logs, list). Uses the `kubernetes/client.js` module for Kubernetes interaction.
* **`kubernetes/client.js`:** Contains the core logic for interacting with the Kubernetes API. Uses `@kubernetes/client-node` to create Deployments, Services, and Ingresses. Handles errors, especially 404s for non-existent resources during deletion.
  - **Key Functions:**
    * `createTrainingDeployment(deploymentName, imageName, command, resources, ports)`
    * `deleteTrainingDeployment(deploymentName)`
    * `getDeploymentLogs(deploymentName)`
    * `listDeployments()`

---

## Development Setup:

1. Ensure Node.js, npm (or yarn), and `kubectl` are installed and `kubectl` is configured to connect to a Kubernetes cluster.
2. Clone the repository.
3. Navigate to `backend/` and run `npm install`.
4. Start the backend: `node index.js`.

---

## API Endpoints (Backend):

* `POST /api/jobs`: Create a training job (request body described in previous responses).
* `DELETE /api/jobs/:deploymentName`: Delete a training job.
* `GET /api/jobs/:deploymentName/logs`: Get logs for a training job.
* `GET /api/jobs`: List all training jobs.

---

## Next Steps (Phase 2 - Advanced Features and Multi-System Integration):

* **Advanced Django Data Models:** Expand data models to include detailed user and organization interactions.
* **Django-Express Collaboration:** Enable Django to manage metadata for organizations and Docker configurations while leaving data processing to Express.
* **CLI Authentication:** Integrate the CLI with Django authentication endpoints for a seamless user experience.

---

## Future Phases (Roadmap):

* **Phase 3: Multi-Cluster Support:** Implement logic to manage multiple customer Kubernetes clusters.
* **Phase 4: Advanced Features:**
  - Job queuing and scheduling.
  - Resource monitoring and alerting.
  - Web UI development.

---

## Contributing:
<Add details here.>

---

## License:
<Include license information here.>
