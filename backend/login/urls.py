from django.contrib import admin
from django.urls import path, include
from .views import addUser, getUser
from . import views
from .views import Token
urlpatterns = [
    # path('admin/', admin.site.urls),
    path("", views.home),
    path("logout", views.logout_view),
    path('addUser/', views.addUser, name='addUser'),
    path('getUser/', views.getUser, name='getUser'),
    path('api/token/', Token.as_view(), name='token'),


]