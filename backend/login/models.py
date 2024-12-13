from django.db import models

# Create your models here.
class Username(models.Model):
    question_text = models.CharField(max_length=25)
    pub_date = models.DateTimeField("date published")


