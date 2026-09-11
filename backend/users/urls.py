from django.urls import path
from .views import register_user, logout_user
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('api/register/', register_user, name='register_user'),
    path('api/login/', TokenObtainPairView.as_view(), name='login'),
    path('api/login/refresh/',TokenRefreshView.as_view(),name='refresh'),
    path('api/logout/', logout_user, name='logout'),
]
