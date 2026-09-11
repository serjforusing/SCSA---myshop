from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AuthenticationTests(APITestCase):
    def test_register_login_and_refresh(self):
        credentials = {
            "username": "student",
            "email": "student@example.com",
            "password": "StrongPass123!",
        }
        response = self.client.post(reverse("register_user"), credentials)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post(reverse("login"), {
            "username": credentials["username"], "password": credentials["password"],
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

        response = self.client.post(reverse("refresh"), {"refresh": response.data["refresh"]})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
