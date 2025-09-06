from django.shortcuts import render
from django.http import JsonResponse
import json
from .models import BlogPost
from django.contrib.auth.decorators import login_required
from urllib.parse import urlparse

# Create your views here.
@login_required
def render_blog_dashboard(request):
    return render(request,"blog_dashboard.html")

def submit_blog(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        content = request.POST.get('content')
        category = request.POST.get('category')
        image = request.FILES.get('image')
        image_url = request.POST.get('image_url')  # <-- Get image URL from form
        summary = request.POST.get('summary')
        draft = request.POST.get("isDraft")
        check=BlogPost.objects.filter(title=title,user=request.user).first()
        if check:
            check.delete()
        blog_post = BlogPost(
            title=title,
            content=content,
            summary=summary,
            category=category,
            user=request.user
        )

        if draft == "true":
            blog_post.draft = True
        else:
            blog_post.draft = False

        if image:
            blog_post.image = image
        elif image_url:
          
            parsed_url = urlparse(image_url)
            blog_post.image = parsed_url.path.replace('/media/', '')  # adjust as needed

        blog_post.save()

        response_data = {
            'status': 'success',
            'message': 'Blog post submitted successfully!'
        }
        return JsonResponse({'response_data': json.dumps(response_data)})

    return render(request, 'blog_dashboard.html')

def get_blogs(request):
    blogs = BlogPost.objects.all().values()
    blogs = list(blogs)
    for blog in blogs:
        if 'image' in blog and blog['image']:
            blog['image'] = request.build_absolute_uri(blog['image'])
    print(blogs)
    return JsonResponse(blogs, safe=False)


def get_draft_blog(request, blog_id):
    try:
        blog = BlogPost.objects.get(id=blog_id)
        blog_data = {
            'id': blog.id,
            'title': blog.title,
            'content': blog.content,
            'image': request.build_absolute_uri(blog.image.url) if blog.image else None,
            'summary': blog.summary,
            'category': blog.category,
            'created_at': blog.created_at,
            'updated_at': blog.updated_at,
            'draft': blog.draft
        }
        return JsonResponse(blog_data)
    except BlogPost.DoesNotExist:
        return JsonResponse({'error': 'Blog post not found'}, status=404)

def render_all_blogs(request):

    published_posts = BlogPost.objects.filter(draft=False)

    def truncate_summary(summary, limit):
        words = summary.split(' ')
        if len(words) > limit:
            return ' '.join(words[:limit]) + '...'
        return summary

    posts_by_category = {}
    for post in published_posts:
        category = post.category
        
        # Truncate the summary for the post
        post.summary = truncate_summary(post.summary, 15)

        if category not in posts_by_category:
            posts_by_category[category] = []
        posts_by_category[category].append(post)

    return render(request, "render_blogs.html", {"posts": posts_by_category})