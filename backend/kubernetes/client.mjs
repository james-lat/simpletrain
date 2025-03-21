import * as k8s from '@kubernetes/client-node';

let k8sApi;  // Declare k8sApi here
let k8sCoreApi;
let k8sNetworkingApi;

async function initializeK8sClient() {
    try {
        const kc = new k8s.KubeConfig();
        const kubeconfigPath = "C:\\MACBOOK_KUBECONFIG\\config"; //temporarily hardocing path to kubeconfig file. 
        kc.loadFromFile(kubeconfigPath); // will be replaced by loadfromdefault(). 
        console.log(`Kubeconfig loaded from: ${kc.currentContext}`); // Log the path
        k8sApi = kc.makeApiClient(k8s.AppsV1Api);
        k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
        k8sNetworkingApi = kc.makeApiClient(k8s.NetworkingV1Api);
        console.log("Kubernetes client initialized successfully.");
    } catch (error) {
        console.error("Error initializing Kubernetes client:", error);
        process.exit(1); // Crucial: Exit if initialization fails
    }
}

async function createTrainingDeployment(deploymentName, imageName, command, resources, ports, namespace = 'default') {
    try {
        // Creates a Kubernetes Deployment, Service and Ingress
        // Parameters:
        // - deploymentName (string): The name of the deployment.
        // - imageName (string): The Docker image name.
        // - command (string): The command to run in the container.
        // - resources (object): Resource requests and limits (CPU, memory, GPU).
        // - ports (array): Array of port mappings.
        const serviceSpec = {
            apiVersion: "v1",
            kind: "Service",
            metadata: {
                name: `${deploymentName}-service`
            },
            spec: {
                selector: {
                    app: "training"
                },
                ports: ports.map(port => ({
                    protocol: "TCP",
                    port: port.containerPort,
                    targetPort: port.containerPort
                }))
            }
        }
        const ingressSpec = {
            apiVersion: 'networking.k8s.io/v1',
            kind: 'Ingress',
            metadata: {
                name: `${deploymentName}-ingress`,
                labels: {
                    createdBy: 'node-client',
                },
                annotations: {
                    'meta.helm.sh/release-namespace': 'production-auto-deploy', // Keep or remove as needed
                },
            },
            spec: {
                ingressClassName: 'nginx',
                rules: [
                    {
                        host: `${deploymentName}.example.com`,
                        http: {
                            paths: [
                                {
                                    path: '/',
                                    pathType: 'ImplementationSpecific',
                                    backend: {
                                        service: {
                                            name: `${deploymentName}-service`,
                                            port: {
                                                number: ports[0].containerPort,
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    },
                ],
                //TLS SECTION GOES HERE
            },
        };
        const deploymentSpec = 
            {
                apiVersion: 'apps/v1',
                kind: 'Deployment',
                metadata: {
                    name: deploymentName
                },
                spec: {
                    replicas: 1,
                    selector: {
                        matchLabels: {
                            app: deploymentName
                        }
                    },
                    template: {
                        metadata: {
                            labels: {
                                app: deploymentName
                            }
                        },
                        spec: {
                            containers: [
                                {
                                    name: deploymentName,
                                    image: imageName,
                                    command: command,
                                    resources: resources,
                                    ports: ports
                                }
                            ]
                        }
                    }
                }
            }
        try { 
            await k8sApi.createNamespacedDeployment({namespace: namespace, body: deploymentSpec})
            console.log(`Deployment created: ${deploymentName}`)
            deploymentCreated = true;
         } catch (deploymentError) {
            console.error("error creating deployment", error)
            throw deploymentError
        } try { 
            await k8sCoreApi.createNamespacedService({namespace: namespace, body: serviceSpec})
            console.log(`Service created: ${deploymentName}-service`)
        } catch (serviceError) {
            console.error("error creating service", error)
            throw serviceError
        } try {
            await k8sNetworkingApi.createNamespacedIngress({namespace: namespace, body: ingressSpec}) 
            console.log(`Ingress created: ${deploymentName}-ingress`)
        } catch (ingressError) {
            console.error("error creating ingress", error)
            throw ingressError
        }
    } catch (error) {
        console.error("error creating deployment", error)
        throw error
    }
}

async function deleteTrainingDeployment(deploymentName, namespace) {
    try {
        await k8sApi.deleteNamespacedDeployment({name: deploymentName, namespace: namespace });
        //await k8sCoreApi.deleteNamespacedService(deploymentName, namespace);
        //await k8sNetworkingApi.deleteNamespacedIngress(deploymentName, namespace);
        console.log(`Deleted deployment resources for: ${deploymentName}`);
    } catch (error) {
        console.error("Error deleting deployment resources:", error);
        throw error;
    }
}

async function getDeploymentLogs(deploymentName, namespace) {
    try {
        // 1. Get the Pods associated with the Deployment
        const podList = await k8sCoreApi.listNamespacedPod({
            namespace: 'default',
            labelSelector: `app=${deploymentName}`,
          });
          

        if (podList.body.items.length === 0) {
            console.log(`No pods found for deployment ${deploymentName} in namespace ${'default'}`);
            return []; // Or throw an error if you prefer
        }

        const logs = [];

        // 2. Get logs from each Pod
        for (const pod of podList.body.items) {
            const podName = pod.metadata.name;
            try {
                const logResponse = await k8sCoreApi.readNamespacedPodLog({
                    name: podName,
                    namespace: 'default',
                  });
                  
                logs.push({ podName, log: logResponse.body });
            } catch (logError) {
                console.error(`Error getting logs for pod ${podName}:`, logError);
                logs.push({ podName, log: `Error retrieving logs: ${logError.message}` }); // Include error message in logs
            }
        }

        return logs;
    } catch (error) {
        console.error("Error getting deployment logs:", error);
        throw error;
    }
}
async function listDeployments(namespace) {
    console.log('**** Inside listDeployments() ****');
    try {
        const deployments = await k8sApi.listNamespacedDeployment({ namespace: namespace });
        console.log("Raw API Response:", JSON.stringify(deployments, null, 2)); // Log the raw response
        return deployments.body.items;
    } catch (error) {
        console.error("Error listing deployments:", error);
        throw error;
    }
}

async function deploymentInfo(deploymentName, namespace) {
    try {
        const deploymentDetails = await k8sApi.readNamespacedDeployment({
            name: deploymentName, 
            namespace: namespace
        }); 
        console.log("Deployment details:", JSON.stringify(deploymentDetails, null, 2)); // Log the raw response
        return deploymentDetails.body;
    } catch (error) {
        console.error("Error reading deployment:", error);
        throw error;
    }
}

export {initializeK8sClient, createTrainingDeployment, deleteTrainingDeployment, getDeploymentLogs, listDeployments, deploymentInfo};
