from django.urls import path 
from login import views



urlpatterns = [
    path('addUser/', views.addUser, name='addUser'),
    path('getUser/', views.getUser, name='getUser')

]