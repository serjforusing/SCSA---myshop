from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ["username" , "email" , "password"]
        extra_kwargs={
            "password":{"write_only":True}
        }

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("ამ ელფოსტით მომხმარებელი უკვე არსებობს.")
        return value

    def create(self,validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            )
        return user


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
