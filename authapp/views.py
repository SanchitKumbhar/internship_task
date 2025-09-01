
from django.shortcuts import render,redirect
from django.contrib.auth import get_user_model,login,  authenticate,logout
from django.contrib.auth.hashers import make_password
from django.http import HttpResponse
from django.core.files.storage import default_storage

# Create your views here.

def render_auth_page(request):
    return render(request, 'auth.html')

def process_signup(request):
    if request.method == 'POST':
        User = get_user_model()

        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        profile_pic = request.FILES.get('profile_picture')
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        address_line1 = request.POST.get('address_line1')
        city = request.POST.get('city')
        state = request.POST.get('state')
        pincode = request.POST.get('pincode')
        user_type = request.POST.get('user_type')  # 'Patient' or 'Doctor'

        if password != confirm_password:
            return HttpResponse("Passwords do not match.", status=400)

        if User.objects.filter(username=username).exists():
            return HttpResponse("Username already exists.", status=400)

        user = User.objects.create(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=make_password(password),
            user_type=user_type,
            address=address_line1 + ", " + city + ", " + state + " - " + pincode
        )

        login(request, user)

        if profile_pic:
            user.profile_picture.save(profile_pic.name, profile_pic)

        user.save()
        return redirect('/dashboard')

def process_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        User = get_user_model()
        user = User.objects.filter(username=username).first()

        if user and user.check_password(password):
            login(request, user)
            return redirect('/dashboard')
        else:
            return HttpResponse("Invalid username or password.", status=400)


def render_dashboard(request):
    # print(request.user.profile_picture.url)
    if request.user.user_type == "Patient":
        print(request.user.username)
        return render(request, 'patient.html', {'user': request.user.username})
    else:
        return render(request, 'dashboard.html', {'user': request.user.username})


def logout_process(request):
    logout(request)
    return HttpResponse("logout")