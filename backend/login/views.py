from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.http import HttpResponse
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
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
