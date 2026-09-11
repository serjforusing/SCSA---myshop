from django.urls import path
from .views import (
    cart_detail,
    cart_item_create,
    cart_item_detail,
    category_list,
    order_detail,
    order_list,
    product_detail,
    product_list,
)

urlpatterns = [
    path('api/product/', product_list, name='product_list'),
    path('api/product/<int:pk>/',product_detail,name='product_detail'),
    path('api/category/',category_list,name='category_list'),
    path('api/cart/', cart_detail, name='cart_detail'),
    path('api/cart/items/', cart_item_create, name='cart_item_create'),
    path('api/cart/items/<int:pk>/', cart_item_detail, name='cart_item_detail'),
    path('api/orders/', order_list, name='order_list'),
    path('api/orders/<int:pk>/', order_detail, name='order_detail'),
]
