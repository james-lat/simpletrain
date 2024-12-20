from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.http import HttpResponse

# Create your views here.
@api_view(['POST'])
def addUser(request):
    if request.method == 'POST':
        data = request.data  
        print("Received data:", data)  
        return Response({"message": "Data received successfully!", "data": data}, status=200) 
    
    return Response({"error": "Method not allowed"}, status=405)



@api_view(['GET'])
def getUser(request):
    return HttpResponse("Hello")