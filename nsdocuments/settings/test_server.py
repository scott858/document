from .base import *
import logging

logging.disable(logging.CRITICAL)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'rgagn4dt_f1l=a^6^z@oz*du8jtkwt@rx5=fmcwb743rcp&@3w'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

TEMPLATE_DEBUG = False

ALLOWED_HOSTS = ['*']
CELERY_ALWAYS_EAGER = True
CELERY_EAGER_PROPAGATES_EXCEPTIONS = True
BROKER_BACKEND = 'memory'

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

MIGRATION_MODULES = {
    'analyses': 'analyses.migrations_not_used_in_tests',
}

# Application definition
INSTALLED_APPS += (
    'django_jenkins',
)

TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'

PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.MD5PasswordHasher',
)

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'nsdata',
        'HOST': 'localhost',
        'USER': 'dev_user',
        'PASSWORD': 'dev_user',
        'ATOMIC_REQUESTS': True,
    }
}
