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
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken, TokenError
import requests
import uuid
from datetime import datetime, timedelta
from django.conf import settings
from django.utils.http import urlencode
from django.contrib.sessions.models import Session

def home(request):
    cli_token = request.GET.get('cli_token', None)
    if cli_token:
        request.session['cli_token'] = cli_token

    # Render the home page
    return render(request, 'home.html', {"cli_token": cli_token})

def sample_view(request):
    current_user = request.user
    print(current_user.id)

sessions = []
@api_view(['GET'])
@permission_classes([AllowAny])
def generate_auth_link(request):
    cli_token = str(uuid.uuid4())
    login_url = f"https://127.0.0.1:8000/login/?cli_token={cli_token}"  # Correct URL path
    return Response(login_url)

    # request.session['authenticated']
    # sessions[session_id] = {
    #     "is_authenticated": False,
    #     "user_id": None,
    #     "jwt_token": None,
    #     "expires_at": (datetime.utcnow() + timedelta(minutes=15))  # Keep this as a datetime object
    # }

    # auth_link = f"{settings.AUTH_PAGE_URL}?session_id={session_id}"

    # # Convert `expires_at` to a string for the JSON response
    # return JsonResponse({
    #     "session_id": session_id,
    #     "auth_link": auth_link,
    #     "expires_at": sessions[session_id]["expires_at"].isoformat()  # Serialize datetime as a string
    # })


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


def addUser(request):
    permission_classes = [AllowAny]
    if request.method == 'POST':
        data = request.data  
        print("Received data:", data)  
        return Response({"message": "Data received successfully!", "data": data}, status=200) 
    
    return Response({"error": "Method not allowed"}, status=405)

    personal_access = "dckr_pat_FlMcVqJ40aHhv4A_70GouTC0ScU"


class Token(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        User = get_user_model()
        user = User.objects.first()  

        if not user:
            return Response({'error': 'No user found'}, status=400)

        # Generate JWT tokens for the user
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        # Add custom claims to the access token
        access_token['docker_access'] = True

        # Debugging: Check token payload
        print(f"Access Token Payload: {access_token.payload}")

        # Construct the response
        content = {
            'refresh': str(refresh),
            'access': str(access_token),  
            'docker_access': access_token.payload.get('docker_access')  
        }
        return Response(content)
    

# @api_view(['GET'])
class VerifyToken(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Authorization header missing or invalid'}, status=401)

        token = auth_header.split(' ')[1]

        try:
            decoded_token = AccessToken(token)

            user_id = decoded_token.get('user_id')  # Get the user ID from the token
            # dockerAccessKey = decoded_token.get('docker_access', False)
            url = 'https://hub.docker.com/v2/users/login'
            payload = {
            'username': 'jameslatimer',
            'password': 'paHMkKJ2PyT#,),'
            }   
            headers = {
            'Content-Type': 'application/json',
            }


            response = requests.post(url, json=payload, headers=headers)

            #Testing Login
            if response.status_code == 200:
                print('Login successfuåçl:', response.json())
            else:
                print(f'Failed to login. Status code: {response.status_code}, Response: {response.text}')
            
            #Showing that we can infact check to see if tokens are valid and can access docker. 
            return Response({
                'message': 'Token is valid',
                'user_id': user_id,
                'docker_access': decoded_token.get('docker_access'),
            })
        

        except TokenError as e:
            return Response({'error': str(e)}, status=401)
