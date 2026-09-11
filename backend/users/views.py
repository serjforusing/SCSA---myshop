from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LogoutSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from drf_spectacular.utils import extend_schema



@extend_schema(request=RegisterSerializer, responses={201: RegisterSerializer})
@api_view (['POST'])
def register_user(request):
    if request.method == "POST":
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@extend_schema(request=LogoutSerializer, responses={205: None})
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    serializer = LogoutSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    try:
        RefreshToken(serializer.validated_data['refresh']).blacklist()
    except TokenError:
        return Response({'detail': 'განახლების ტოკენი არასწორია.'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_205_RESET_CONTENT)
