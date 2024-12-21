from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    path('addUser/', views.addUser, name='addUser'),
    path('getUser/', views.getUser, name='getUser')

]