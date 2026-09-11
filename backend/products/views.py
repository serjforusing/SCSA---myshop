from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, CartItem, Order, OrderItem, Product,Category
from .serializers import (
    CartItemCreateSerializer,
    CartItemSerializer,
    CartQuantitySerializer,
    CartSerializer,
    CategorySerializer,
    OrderSerializer,
    ProductSerializer,
)
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.pagination import PageNumberPagination
from django.db import transaction
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter




@extend_schema(
    methods=['GET'],
    operation_id='product_list',
    parameters=[
        OpenApiParameter('search', str),
        OpenApiParameter('category', int),
        OpenApiParameter('ordering', str),
        OpenApiParameter('page', int),
    ],
    responses=ProductSerializer(many=True),
)
@extend_schema(methods=['POST'], operation_id='product_create', request=ProductSerializer, responses={201: ProductSerializer})
@api_view(["GET","POST"])
@permission_classes([IsAuthenticatedOrReadOnly])
def product_list(request):
    if request.method == 'GET':
        products = Product.objects.select_related('owner', 'category').all()

        search = request.query_params.get('search', '').strip()
        category = request.query_params.get('category', '').strip()
        ordering = request.query_params.get('ordering', '-created_at')

        if search:
            products = products.filter(Q(name__icontains=search) | Q(description__icontains=search))
        if category.isdigit():
            products = products.filter(category_id=category)
        if ordering.lstrip('-') not in {'name', 'price', 'created_at', 'stock'}:
            ordering = '-created_at'

        products = products.order_by(ordering)
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(products, request)
        serializer = ProductSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(owner = request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@extend_schema(methods=['GET'], operation_id='product_retrieve', responses=ProductSerializer)
@extend_schema(methods=['PUT'], operation_id='product_update', request=ProductSerializer, responses=ProductSerializer)
@extend_schema(methods=['DELETE'], operation_id='product_delete', responses={204: None})
@api_view(['GET','PUT','DELETE'])
@permission_classes([IsAuthenticatedOrReadOnly])
def product_detail(request,pk):
    product = get_object_or_404(Product,pk=pk)
    if request.method == 'GET':
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'PUT':
        if product.owner != request.user:
            return Response( 
                    {"detail":"არ არის ნებადართული."},
                    status = status.HTTP_403_FORBIDDEN
            )
        serializer = ProductSerializer(product,data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data , status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
          if product.owner != request.user:
                    return Response( 
                            {"detail":"არ არის ნებადართული."},
                            status = status.HTTP_403_FORBIDDEN
                    )
    product.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(operation_id='category_list', responses=CategorySerializer(many=True))
@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def category_list(request):
    if request.method == "GET":
        category = Category.objects.all()
        serializer = CategorySerializer(category,many=True)
        return Response(serializer.data)


@extend_schema(operation_id="cart_retrieve", responses=CartSerializer)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def cart_detail(request):
    cart = Cart.objects.filter(user=request.user).prefetch_related("items__product").first()
    if not cart:
        return Response({"id": None, "items": [], "total_quantity": 0, "total_price": "0.00"})
    return Response(CartSerializer(cart).data)


@extend_schema(operation_id="cart_item_create", request=CartItemCreateSerializer, responses={201: CartItemSerializer})
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cart_item_create(request):
    serializer = CartItemCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    product = serializer.validated_data["product"]
    quantity = serializer.validated_data["quantity"]

    with transaction.atomic():
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart = Cart.objects.select_for_update().get(pk=cart.pk)
        item = CartItem.objects.filter(cart=cart, product=product).first()
        new_quantity = quantity + (item.quantity if item else 0)
        if new_quantity > product.stock:
            return Response({"quantity": "მარაგში საკმარისი რაოდენობა არ არის."}, status=status.HTTP_400_BAD_REQUEST)
        if item:
            item.quantity = new_quantity
            item.save(update_fields=["quantity"])
        else:
            item = CartItem.objects.create(cart=cart, product=product, quantity=quantity)

    return Response(CartItemSerializer(item).data, status=status.HTTP_201_CREATED)


@extend_schema(methods=["PATCH"], operation_id="cart_item_update", request=CartQuantitySerializer, responses=CartItemSerializer)
@extend_schema(methods=["DELETE"], operation_id="cart_item_delete", responses={204: None})
@api_view(["PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def cart_item_detail(request, pk):
    with transaction.atomic():
        item = get_object_or_404(
            CartItem.objects.select_for_update().select_related("product"),
            pk=pk,
            cart__user=request.user,
        )
        if request.method == "DELETE":
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = CartQuantitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quantity = serializer.validated_data["quantity"]
        if quantity > item.product.stock:
            return Response({"quantity": "მარაგში საკმარისი რაოდენობა არ არის."}, status=status.HTTP_400_BAD_REQUEST)
        item.quantity = quantity
        item.save(update_fields=["quantity"])
        return Response(CartItemSerializer(item).data)


@extend_schema(
    methods=["GET"],
    operation_id="order_list",
    parameters=[OpenApiParameter("status", str), OpenApiParameter("ordering", str), OpenApiParameter("page", int)],
    responses=OrderSerializer(many=True),
)
@extend_schema(methods=["POST"], operation_id="order_create", request=OrderSerializer, responses={201: OrderSerializer})
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def order_list(request):
    if request.method == "GET":
        orders = Order.objects.filter(user=request.user).prefetch_related("items")
        order_status = request.query_params.get("status", "")
        ordering = request.query_params.get("ordering", "-created_at")
        if order_status in Order.Status.values:
            orders = orders.filter(status=order_status)
        if ordering.lstrip("-") not in {"created_at", "total_price", "status"}:
            ordering = "-created_at"
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(orders.order_by(ordering), request)
        return paginator.get_paginated_response(OrderSerializer(page, many=True).data)

    serializer = OrderSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    with transaction.atomic():
        cart = Cart.objects.filter(user=request.user).first()
        if not cart:
            return Response({"detail": "კალათა ცარიელია."}, status=status.HTTP_400_BAD_REQUEST)
        cart_items = list(CartItem.objects.filter(cart=cart).select_related("product"))
        if not cart_items:
            return Response({"detail": "კალათა ცარიელია."}, status=status.HTTP_400_BAD_REQUEST)

        products = Product.objects.select_for_update().in_bulk(item.product_id for item in cart_items)
        for item in cart_items:
            product = products.get(item.product_id)
            if not product or item.quantity > product.stock:
                return Response(
                    {"detail": f"პროდუქტის „{item.product.name}“ მარაგი საკმარისი აღარ არის."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        order = Order.objects.create(user=request.user, **serializer.validated_data)
        order_items = []
        total = 0
        changed_products = []
        for item in cart_items:
            product = products[item.product_id]
            subtotal = product.price * item.quantity
            total += subtotal
            product.stock -= item.quantity
            changed_products.append(product)
            order_items.append(OrderItem(
                order=order,
                product=product,
                product_name=product.name,
                unit_price=product.price,
                quantity=item.quantity,
            ))

        OrderItem.objects.bulk_create(order_items)
        Product.objects.bulk_update(changed_products, ["stock"])
        order.total_price = total
        order.save(update_fields=["total_price"])
        CartItem.objects.filter(cart=cart).delete()

    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@extend_schema(operation_id="order_retrieve", responses=OrderSerializer)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def order_detail(request, pk):
    order = get_object_or_404(
        Order.objects.prefetch_related("items"),
        pk=pk,
        user=request.user,
    )
    return Response(OrderSerializer(order).data)
    
