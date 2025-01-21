from django.contrib import admin
from django.urls import path, include
from .views import addUser
from . import views
from .views import Token, VerifyToken
urlpatterns = [
    path('admin/', admin.site.urls),
    path("", views.home),
    path("logout", views.logout_view),
    path('addUser/', views.addUser, name='addUser'),
    path('api/token/', Token.as_view(), name='token'),
    path('api/create-deployment/', views.create_deployment, name='create_deployment'),
    path('api/dockerAccess/', VerifyToken.as_view(), name='dockerAccess')
]