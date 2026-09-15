from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import CartItem, Category, Order, Product


class ProductApiTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username="owner", password="StrongPass123!")
        self.other_user = User.objects.create_user(username="other", password="StrongPass123!")
        self.category = Category.objects.create(name="Books")
        self.product = Product.objects.create(
            owner=self.owner,
            category=self.category,
            name="Python Book",
            price="25.00",
            description="DRF guide",
            stock=3,
        )

    def test_owner_crud_and_permission(self):
        self.client.force_authenticate(self.owner)
        response = self.client.post(reverse("product_list"), {
            "name": "React Book", "price": "20.00", "description": "React guide",
            "category": self.category.id, "stock": 2,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["owner"], self.owner.username)

        self.client.force_authenticate(self.other_user)
        response = self.client.delete(reverse("product_detail", args=[self.product.id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_product_image_upload(self):
        self.client.force_authenticate(self.owner)
        image = SimpleUploadedFile(
            "product.gif",
            b"GIF89a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;",
            content_type="image/gif",
        )
        response = self.client.post(reverse("product_list"), {
            "name": "Camera", "price": "100.00", "description": "Digital camera",
            "category": self.category.id, "stock": 1, "image": image,
        }, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("/media/products/", response.data["image"])

    def test_search_filter_order_and_pagination(self):
        response = self.client.get(reverse("product_list"), {
            "search": "Python", "category": self.category.id, "ordering": "price",
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["name"], "Python Book")

    def test_cart_is_user_specific_and_quantity_can_be_changed(self):
        self.client.force_authenticate(self.owner)
        response = self.client.post(reverse("cart_item_create"), {"product": self.product.id, "quantity": 1})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        item_id = response.data["id"]

        response = self.client.patch(reverse("cart_item_detail", args=[item_id]), {"quantity": 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["quantity"], 2)

        self.client.force_authenticate(self.other_user)
        response = self.client.patch(reverse("cart_item_detail", args=[item_id]), {"quantity": 1})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(self.client.get(reverse("cart_detail")).data["items"], [])

        self.client.force_authenticate(self.owner)
        self.assertEqual(self.client.delete(reverse("cart_item_detail", args=[item_id])).status_code, status.HTTP_204_NO_CONTENT)

    def test_checkout_reduces_stock_and_creates_private_order(self):
        self.client.force_authenticate(self.owner)
        self.client.post(reverse("cart_item_create"), {"product": self.product.id, "quantity": 2})
        response = self.client.post(reverse("order_list"), {
            "full_name": "ნინო გიორგაძე",
            "phone": "555123456",
            "address": "თბილისი, რუსთაველის 10",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["total_price"], "50.00")
        self.assertEqual(response.data["status"], Order.Status.PENDING)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 1)
        self.assertFalse(CartItem.objects.filter(cart__user=self.owner).exists())

        self.client.force_authenticate(self.other_user)
        self.assertEqual(
            self.client.get(reverse("order_detail", args=[response.data["id"]])).status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_checkout_is_atomic_when_stock_changed(self):
        self.client.force_authenticate(self.owner)
        self.client.post(reverse("cart_item_create"), {"product": self.product.id, "quantity": 3})
        self.product.stock = 1
        self.product.save(update_fields=["stock"])

        response = self.client.post(reverse("order_list"), {
            "full_name": "ნინო გიორგაძე",
            "phone": "555123456",
            "address": "თბილისი, რუსთაველის 10",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(Order.objects.exists())
        self.assertTrue(CartItem.objects.filter(cart__user=self.owner).exists())
