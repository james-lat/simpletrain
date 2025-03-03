"""
URL configuration for auth project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib import admin
from django.urls import include, path
from django.shortcuts import redirect
from django.conf import settings
from login import views
# from login.views import home
# from oauth2_provider import urls as oauth2_urls

app_name = 'login'

# def store_cli_token(request):
#     cli_token = request.GET.get('cli_token', '')
#     if cli_token:
#         request.session['cli_token'] = cli_token  # Save token in session
#     return redirect(f"{settings.AUTH_PAGE_URL}")  # Redirect to Google login
  

urlpatterns = [
    # path("", views.home),
    path('admin/', admin.site.urls),    
    # path('o/', include(oauth2_urls)),
    path('accounts/', include('allauth.urls')),
    path('', include('login.urls')),
    # path('accounts/google/prelogin/', store_cli_token, name='store_cli_token'),
]

