# from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.shortcuts import resolve_url

# class MySocialAccountAdapter(DefaultSocialAccountAdapter):
#     def get_login_redirect_url(self, request):
#         cli_token = request.session.get('cli_token', '')  # Retrieve token from session
#         if cli_token:
#             print("yo")
#             return f"https://127.0.0.1:8000/?cli_token={cli_token}"
#         return resolve_url('')  # Default if no token found
