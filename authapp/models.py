from django.db import models
from django.contrib.auth.models import AbstractUser

# Choices for user types
USER_TYPE_CHOICES = (
    ("Patient", "Patient"),
    ("Doctor", "Doctor"),
)

class CustomUser(AbstractUser):
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default="student")
    address = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profile_pics/", blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.user_type})"
    