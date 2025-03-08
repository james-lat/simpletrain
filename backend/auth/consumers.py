import json
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)

class MyConsumer(WebsocketConsumer):
    connections = {}

    def connect(self):
        self.accept()
        token = self.scope['url_route']['kwargs']['token']
        self.connections[token] = self

        session = self.scope.get("session")
        if session is None:
            logger.error("Session not found in scope")
            self.send(text_data=json.dumps({'status': 'error', 'message': 'Session unavailable'}))
            self.close()
            return

        logger.debug(f"WebSocket session: {dict(session)}, Token: {token}")

       
    def disconnect(self, close_code):
        token = self.scope['url_route']['kwargs']['token']
        if token in self.connections:
            del self.connections[token]

    def receive(self, text_data):
        pass