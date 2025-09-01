from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Extra Info", {"fields": ("user_type", "address", "profile_picture")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Extra Info", {"fields": ("user_type", "address", "profile_picture")}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
