from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from .models import Deployment, Organization, User
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken  # <-- Add this import
from django.contrib.auth.models import User  # <-- Import User model
from django.shortcuts import render, redirect



# Create your views here.

def home(request):
    return(render(request, "home.html"))

def logout_view(request):
    logout_view(request)
    return()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_deployment(request):
    try:
        data = request.data
        deployment_name = data.get('deployment_name')
        namespace = data.get('namespace')
        resource = data.get('resource')
        image = data.get('image')
        command_arguments = data.get('command_arguments')
        ports = data.get('ports')
        service_port = data.get('service_port')
        ingress_hostname = data.get('ingress_hostname')
        user = request.user
        if not user.create_deployments:
            return Response({"error": "You do not have permission to create deployments."}, status=status.HTTP_403_FORBIDDEN)

        if not deployment_name or not namespace or not resource or not image or not ports or not service_port or not ingress_hostname:
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)
        
        if Deployment.objects.filter(deployment_name=deployment_name).exists():
            return Response({"error": "Deployment with this name already exists."}, status=status.HTTP_400_BAD_REQUEST)

        deployment = Deployment(
            user=user,
            organization=user.organization,
            deployment_name=deployment_name,
            namespace=namespace,
            resource=resource,
            image=image,
            command_arguments=command_arguments,
            ports=ports,
            service_port=service_port,
            ingress_hostname=ingress_hostname
        )
        deployment.save()

        return Response({"message": "Deployment created successfully!", "id": deployment.id}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([AllowAny])
def addUser(request):
    if request.method == 'POST':
        data = request.data  
        print("Received data:", data)  
        return Response({"message": "Data received successfully!", "data": data}, status=200) 
    
    return Response({"error": "Method not allowed"}, status=405)



@api_view(['GET'])
def getUser(request):
    return HttpResponse("Hello")
# @permission_classes([AllowAny])
class Token(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Fetch any user for demonstration
        user = User.objects.first()
        
        # Generate JWT tokens for the user
        refresh = RefreshToken.for_user(user)

        content = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        return Response(content)
    
def sample_view(request):
    current_user = request.user
    print(current_user.id)
