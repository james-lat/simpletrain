from django.contrib import admin
from django.urls import path, include
from .views import addUser
from . import views
from .views import Token, VerifyToken, CLIToken
from .views import addUser, GoogleAuthLoginView  
from allauth.socialaccount.providers.google import views as google_views  # Import Google callback view
urlpatterns = [
    path('admin/', admin.site.urls),
    # path("logout", views.logout_view),
    path("api/auth_link/", views.generate_auth_link),
    path('api/auth_status/', views.auth_status),
    path('addUser/', views.addUser, name='addUser'),
    path('api/token/', Token.as_view(), name='token'),
    path('api/create-deployment/', views.create_deployment, name='create_deployment'),
    path('api/dockerAccess/', VerifyToken.as_view(), name='dockerAccess'),
    path('auth/cli/<uuid:token>/', views.cli_auth, name="cli_auth"),
    #login URL
    path('accounts/google/login/', GoogleAuthLoginView.as_view(), name='google_login'),
    
    # Google callback URL (using Allauth's default)
    path('accounts/google/login/callback/', google_views.oauth2_callback, name='google_callback'),

]