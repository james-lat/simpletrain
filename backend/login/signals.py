from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from django.utils.timezone import now
import logging
from auth.consumers import MyConsumer 
from django.dispatch import Signal
import json
logger = logging.getLogger(__name__)
# from .signals import cli_token_authenticated_changed

cli_token_authenticated_changed = Signal()

@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    print("LOGIN")
    print("Before setting cli_token_authenticated:", request.session.get("cli_token_authenticated", False))
    #set this to true if logged in already
    request.session["cli_token_authenticated"] = True
    request.session.modified = True

    # Extract token from the session
    token = request.session.get("cli_token")
    if token in MyConsumer.connections:
        websocket_connection = MyConsumer.connections[token]
        websocket_connection.send(text_data=json.dumps({'status': 'authenticated'}))

@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    request.session.flush()  

@receiver(cli_token_authenticated_changed)
def cli_token_handler(sender, request, value, **kwargs):
    token = request.session.get("cli_token")
    if token in MyConsumer.connections:
        websocket_connection = MyConsumer.connections[token]
        websocket_connection.send(text_data=json.dumps({'status': 'authenticated'}))

    
    