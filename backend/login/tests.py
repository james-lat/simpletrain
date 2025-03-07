from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Organization

class DeploymentTestCase(APITestCase):
    def setUp(self):
        # Create Organization
        self.org = Organization.objects.create(name="TestOrg")

        # Create User
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpass123',
            organization=self.org,
            create_deployments=True
        )

        # Authenticate user
        self.client.force_authenticate(user=self.user)

        # Deployment data
        self.data = {
            "deployment_name": "test-deployment",
            "namespace": "test-namespace",
            "resource": {"cpu": "500m", "memory": "512Mi"},
            "image": "nginx:latest",
            "command_arguments": ["run", "--port=80"],
            "ports": [80, 443],
            "service_port": 8080,
            "ingress_hostname": "test.example.com"
        }

    def test_create_deployment(self):
        response = self.client.post("/api/create-deployment/", self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        print(response)