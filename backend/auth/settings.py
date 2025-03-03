from pathlib import Path
import os
from dotenv import load_dotenv
from datetime import timedelta
# import adapters
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-*20z!hvp7elxt+gb5xh%oav654^ovu+0qiq#np=l)ygccvue)*'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

load_dotenv()

OIDC_RSA_PRIVATE_KEY = os.getenv('OIDC_RSA_PRIVATE_KEY')

ACCOUNT_AUTHENTICATED_REDIRECT_URL = '/'
ACCOUNT_SIGNUP_REDIRECT_URL = '/'

CLIENT_ID = "781744511362-9d5go25ee5l9ur3lp17it26e1ts06ejo.apps.googleusercontent.com"
CLIENT_SECRET = "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"

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
ACCOUNT_AUTHENTICATED_REDIRECT_URL = '/'  
LOGIN_REDIRECT_URL = '/'  
# SOCIALACCOUNT_ADAPTER = 'auth.adapters.MySocialAccountAdapter'
SESSION_ENGINE = "django.contrib.sessions.backends.db"
SESSION_SAVE_EVERY_REQUEST = True
ASGI_APPLICATION = "auth.asgi.application"

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'daphne',
    'django.contrib.staticfiles',  
    'login',
    'rest_framework',
    'rest_framework_simplejwt',
    'django_extensions',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'django.contrib.sites',
]

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    },
}

# ACCOUNT_ADAPTER = 'myapp.adapters.NoSignupAdapter'
# SOCIALACCOUNT_ADAPTER = 'myapp.adapters.RestrictedSocialAccountAdapter'


# Commented out OAuth toolkit configuration
# OAUTH2_PROVIDER = {
#     "OIDC_ENABLED": True,
#     "OIDC_RSA_PRIVATE_KEY": OIDC_RSA_PRIVATE_KEY,
#     "SCOPES": {
#         "openid": "OpenID Connect scope",
#     },
# }

# OAUTH2_PROVIDER_APPLICATION_MODEL = "oauth.MyApplication"
# OAUTH2_PROVIDER_REFRESH_TOKEN_MODEL = "oauth.MyRefreshToken"
# OAUTH2_PROVIDER_GRANT_MODEL = "oauth.MyGrant"
# OAUTH2_PROVIDER_ACCESS_TOKEN_MODEL = "oauth.MyAccessToken"

AUTH_USER_MODEL = 'login.User'

AUTH_PAGE_URL = "https://127.0.0.1:8443/accounts/login/"
SOCIAL_AUTH_GOOGLE_OAUTH2_REDIRECT_URI = 'https://127.0.0.1:8443/accounts/google/login/callback/'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
    'SLIDING_TOKEN_LIFETIME': timedelta(days=30),
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",  # Default backend
    "allauth.account.auth_backends.AuthenticationBackend",  # Allauth backend
]

SITE_ID = 1
ROOT_URLCONF = 'auth.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',  # Required by Allauth
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'auth.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": CLIENT_ID,
            "secret": CLIENT_SECRET,
        },
        "SCOPE": ["profile", "email"],  # Request access to user's profile and email
        "AUTH_PARAMS": {"access_type": "online"},  # Optional: Set access type
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LOGIN_URL = '/admin/login/' 

# Internationalization
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
