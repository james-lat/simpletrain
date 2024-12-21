from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.http import HttpResponse

# Create your views here.
@api_view(['POST'])
def addUser(request):
    print("sugma")

@api_view(['GET'])
def getUser(request):
    return HttpResponse("Nick is gay")
