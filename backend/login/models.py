
# Create your models here.
# class AbstractUser(models.Model):
#     username = models.CharField(max_length=150, unique=True, blank=False, null=False)
#     email = models.EmailField(unique=True, blank=False, null=False)
#     password = models.CharField(max_length=128, blank=False, null=False)

#     class Meta:
#         abstract = True

# class AppUser(AbstractUser):
#     timestamp = models.DateTimeField(auto_now_add=True)

from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass