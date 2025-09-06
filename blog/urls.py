from django.contrib import admin
from django.urls import path, include   
from .views import render_blog_dashboard,render_all_blogs, submit_blog,get_blogs,get_draft_blog
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('create-blog', render_blog_dashboard, name='create-blog'),
    path('all-blogs', render_all_blogs, name='all-blogs'),
    path('submit-blog', submit_blog, name='submit-blog'),
    path('get-blogs', get_blogs, name='get-blogs'),
    path('get-blog/<int:blog_id>/', get_draft_blog, name='get-blog'),
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)