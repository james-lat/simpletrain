from django.contrib import admin
from django.urls import path, include
from .views import addUser
from . import views
from .views import Token, VerifyToken
urlpatterns = [
    path('admin/', admin.site.urls),
    # path("logout", views.logout_view),
    path("login/", views.home),
    path("api/auth_link/", views.generate_auth_link),
    path('addUser/', views.addUser, name='addUser'),
    path('api/token/', Token.as_view(), name='token'),
    path('api/create-deployment/', views.create_deployment, name='create_deployment'),
    path('api/dockerAccess/', VerifyToken.as_view(), name='dockerAccess')
]