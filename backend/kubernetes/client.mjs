import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api)
const k8sNetworkingApi = kc.makeApiClient(k8s.NetworkingV1Api)
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
        ingressSpec = {
            apiVersions: 'networking.k8s.io/v1',
            kind: 'Ingress',
            metadata: {
                name: `production-custom-${clientIdentifier}`,
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
                        host: `${clientIdentifier}`,
                        http: {
                            paths: [
                                {
                                    backend: {
                                        service: {
                                            name: 'production-auto-deploy',
                                            port: {
                                                number: 5000,
                                            },
                                        },
                                    },
                                    path: '/default-kuberiq(/|$)(.*)',
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
        const createIngressRes = k8sApi.createNamespacedIngress(namespace, ingressSpec)
        .then((response) => {
            console.log('Ingress created:', response.body);
        }) 
        k8sApi.createNamespacedDeployment(namespace, deploymentSpec)
        .then((response) => {
            console.log('Deployment created:', response.body);
        })
        
    } catch (error) {
        console.error("error creating deployment", error)
        throw error
    }
}

async function deleteTrainingDeployment(deploymentName) {
    try {
        //deleting deployment 
        try { 
            await k8sApi.deleteNamespacedDeployment(deploymentName, namespace); 
            console.log('Deleting deployment: ' + deploymentName);
        } catch (error) {
            console.error("error deleting deployment", error)
            throw error
        }
        // Deletes a Kubernetes Deployment, Service and Ingress.
        // Parameters:
        // - deploymentName (string): The name of the deployment to delete.
    } catch (error) {
        console.error("error deleting deployment", error)
        throw error
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
    try {
        // Gets all deployments in the namespace
        k8sApi.listNamespacedPod('default').then((res) => {
            console.log(res.body);
        });
    } catch (error) {
        console.error("error getting deployments", error)
        throw error
    }
}

export { createTrainingDeployment, deleteTrainingDeployment, getDeploymentLogs, listDeployments };
