from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem, Product, Category

class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(source='owner.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'owner', 'is_owner', 'name', 'price', 'description', 'category', 'category_name', 'created_at', 'updated_at', 'stock', 'image']
        read_only_fields = ['owner', 'created_at', 'updated_at']

    def get_is_owner(self, product) -> bool:
        request = self.context.get('request')
        return bool(request and request.user.is_authenticated and product.owner == request.user)

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError('ფასი უნდა იყოს ნულზე მეტი.')
        return value

    def validate_image(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError('სურათი არ უნდა აღემატებოდეს 5 MB-ს.')
        return value


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=2, read_only=True)
    available_stock = serializers.IntegerField(source="product.stock", read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "product", "product_name", "product_price", "available_stock", "quantity", "subtotal"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_quantity = serializers.IntegerField(read_only=True)
    total_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "items", "total_quantity", "total_price", "updated_at"]


class CartItemCreateSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    quantity = serializers.IntegerField(min_value=1, default=1)


class CartQuantitySerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "unit_price", "quantity", "subtotal"]


class OrderSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "status", "status_display", "full_name", "phone", "address", "total_price", "created_at", "updated_at", "items"]
        read_only_fields = ["status", "total_price", "created_at", "updated_at", "items"]

    def validate_full_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("სახელი და გვარი შეავსე სწორად.")
        return value.strip()

    def validate_phone(self, value):
        if len(value.strip()) < 6:
            raise serializers.ValidationError("ტელეფონის ნომერი შეავსე სწორად.")
        return value.strip()

    def validate_address(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError("მისამართი შეავსე სრულად.")
        return value.strip()
