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
const namespace = 'default';
async function createTrainingDeployment(deploymentName, imageName, command, resources, ports) {
    try {
        // Creates a Kubernetes Deployment, Service and Ingress
        // Parameters:
        // - deploymentName (string): The name of the deployment.
        // - imageName (string): The Docker image name.
        // - command (string): The command to run in the container.
        // - resources (object): Resource requests and limits (CPU, memory, GPU).
        // - ports (array): Array of port mappings.
        const service = {
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
        ingressSpec = {
            apiVersions: 'networking.k8s.io/v1',
            kind: 'Ingress',
            metadata: {
                name: `${deploymentName}-ingress`,
                labels: {
                    createdBy: 'node-client',
                },
                annotations: {
                    'meta.helm.sh/release-namespace': 'production-auto-deploy',
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
                                    backend: {
                                        service: {
                                            name: 'production-auto-deploy',
                                            port: {
                                                number: ports[0].containerPort,
                                            },
                                        },
                                    },
                                    path: '/',
                                    pathType: 'ImplementationSpecific',
                                },
                            ],
                        },
                    },
                ],
                tls: [
                    {
                        hosts: [`${clientIdentifier}.example.com`],
                    },
                ],
            }
        }
        deploymentSpec = 
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
            await k8sApi.createNamespacedDeployment(namespace, deploymentSpec)
            await k8sCoreApi.createNamespacedService(namespace, service)
            await k8sNetworkingApi.createNamespacedIngress(namespace, ingressSpec) 
        } catch (error) {
            console.error("error creating deployment", error)
            throw error
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

async function getDeploymentLogs(deploymentName) {
    try {
        // Gets logs from the pods of a deployment
        // Parameters:
        // - deploymentName (string): The name of the deployment to get logs from
    } catch (error) {
        console.error("error getting logs", error)
        throw error
    }
}

async function listDeployments() {
    console.log('**** Inside listDeployments() ****');
    try {
        const deployments = await k8sApi.listNamespacedDeployment({ namespace: 'default' });
        console.log("Raw API Response:", JSON.stringify(deployments, null, 2)); // Log the raw response
        return deployments.body.items;
    } catch (error) {
        console.error("Error listing deployments:", error);
        throw error;
    }
}

export {initializeK8sClient, createTrainingDeployment, deleteTrainingDeployment, getDeploymentLogs, listDeployments };
