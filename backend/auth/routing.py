from django.urls import re_path
from .consumers import MyConsumer  # Import your WebSocket consumer

websocket_urlpatterns = [
    re_path(r"^ws/auth/cli/(?P<token>[a-f0-9\-]{36})/$", MyConsumer.as_asgi())
]