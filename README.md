# GPU Training Service (Development README)

This document is intended for the development team and focuses on the architecture, current state, and next steps for the GPU Training Service project.

**Project Goal:** Provide a secure and scalable service for researchers to run training jobs on GPU clusters.

**Current Status (Phase 1 - Core Kubernetes Interaction):**

The backend component is the current focus. It implements core Kubernetes interaction for managing training jobs:

*   **Job Creation:** Creates Kubernetes Deployments, Services, and Ingresses.
*   **Job Deletion:** Deletes Deployments, Services, and Ingresses.
*   **Log Retrieval:** Retrieves logs from training Pods.
*   **Job Listing:** Lists existing Deployments.

**Architecture (Centralized Backend):**

**Technology Stack:**

*   **Backend:** Node.js, Express.js
*   **Kubernetes Interaction:** `@kubernetes/client-node`
*   **CLI (Future):** JavaScript (Commander.js, readline, chalk, axios)
*   **Containerization:** Docker (for backend and training images)

**File Structure:**


**Backend Implementation Details:**

*   **`index.js`:** Sets up the Express app, mounts routes, and handles basic error handling.
*   **`routes/jobs.js`:** Defines API endpoints for managing training jobs (create, delete, get logs, list). Uses the `kubernetes/client.js` module for Kubernetes interaction.
*   **`kubernetes/client.js`:** Contains the core logic for interacting with the Kubernetes API. Uses `@kubernetes/client-node` to create Deployments, Services, and Ingresses. Handles errors, especially 404s for non-existent resources during deletion.
*   **Key Functions in `kubernetes/client.js`:**
    *   `createTrainingDeployment(deploymentName, imageName, command, resources, ports)`: Creates Deployment, Service, and Ingress. Maps input parameters to Kubernetes spec fields. Handles port mappings.
    *   `deleteTrainingDeployment(deploymentName)`: Deletes Deployment, Service, and Ingress. Handles cases where resources don't exist (404 errors).
    *   `getDeploymentLogs(deploymentName)`: Retrieves logs from the pods of a Deployment.
    *   `listDeployments()`: Lists all Deployments in the default Namespace.
*   **Error Handling:** All API calls and Kubernetes interactions include `try...catch` blocks for robust error handling.

**CLI Implementation Details (`cli/index.js`):**

*   Uses `commander` for command-line argument parsing.
*   Implements a basic `login` command that prompts for username and password (no actual authentication implemented yet – placeholder).
*   Uses `readline` for secure password input (hiding the password as it's typed).
*   Uses `axios` for making HTTP requests to the backend API (not yet fully integrated).

**Development Setup:**

1.  Ensure Node.js, npm (or yarn), and `kubectl` are installed and `kubectl` is configured to connect to a Kubernetes cluster.
2.  Clone the repository.
3.  Navigate to `backend/` and run `npm install`.
4.  Start the backend: `node index.js`.

**API Endpoints (Backend):**

*   `POST /api/jobs`: Create a training job (request body described in previous responses).
*   `DELETE /api/jobs/:deploymentName`: Delete a training job.
*   `GET /api/jobs/:deploymentName/logs`: Get logs for a training job.
*   `GET /api/jobs`: List all training jobs.

**Next Steps (Phase 2 - Authentication and User Management):**

*   **Implement User Model:** Create a data model for users (e.g., using Mongoose for MongoDB, or a simple in-memory store for initial development).
*   **Implement Authentication Routes:** Create API endpoints for user registration (`POST /api/auth/register`) and login (`POST /api/auth/login`).
*   **Implement Authentication Middleware:** Create middleware to protect API endpoints and ensure only authenticated users can access certain resources.
*   **Integrate Authentication with Job Management:** Modify job routes to require authentication and associate jobs with users.
*   **CLI Integration:** Integrate the CLI with the authentication endpoints to allow users to log in and manage their jobs.

**Future Phases (Roadmap):**

*   **Phase 3: Multi-Cluster Support:** Implement logic to manage multiple customer Kubernetes clusters.
*   **Phase 4: Advanced Features:**
    *   Job queuing and scheduling.
    *   Resource monitoring and alerting.
    *   Database integration.
    *   Web UI development.

**Contributing:**



**License:**

