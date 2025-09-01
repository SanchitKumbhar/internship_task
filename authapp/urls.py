from django.contrib import admin
from django.urls import path, include   
from .views import process_signup, process_login,render_auth_page,render_dashboard,logout_process
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('auth-page',render_auth_page, name='auth-page'),
    path('signup', process_signup, name='signup'),
    path('login', process_login, name='login'),
    path('dashboard', render_dashboard, name='dashboard'),
    path('logout', logout_process, name='dashboard'),
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)