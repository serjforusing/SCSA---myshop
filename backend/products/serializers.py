from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem, Product, Category

class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(source='owner.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_owner = serializers.SerializerMethodField()
    remove_image = serializers.BooleanField(write_only=True, required=False)

    class Meta:
        model = Product
        fields = ['id', 'owner', 'is_owner', 'name', 'price', 'description', 'category', 'category_name', 'created_at', 'updated_at', 'stock', 'image', 'image_url', 'remove_image']
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

    def validate_image_url(self, value):
        if value and not value.startswith('https://'):
            raise serializers.ValidationError('სურათის ლინკი უნდა იწყებოდეს https://-ით.')
        return value

    def validate(self, attrs):
        if attrs.get('image') and attrs.get('image_url'):
            raise serializers.ValidationError('აირჩიე სურათის ფაილი ან ლინკი.')
        return attrs

    def create(self, validated_data):
        validated_data.pop('remove_image', None)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        remove_image = validated_data.pop('remove_image', False)
        if remove_image or validated_data.get('image') or validated_data.get('image_url'):
            instance.image.delete(save=False)
        if remove_image:
            validated_data.update(image=None, image_url='')
        elif validated_data.get('image'):
            validated_data['image_url'] = ''
        return super().update(instance, validated_data)


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
