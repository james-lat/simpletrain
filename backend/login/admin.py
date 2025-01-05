from django.contrib import admin
from .models import User, Organization, Deployment


admin.site.register(User)
admin.site.register(Organization)
admin.site.register(Deployment)
# Register your models here.
# class UserAdmin(admin):
