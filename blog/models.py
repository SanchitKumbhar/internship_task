from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    summary = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    draft=models.BooleanField(null=True)
    user=models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    def __str__(self):
        return self.title