from datetime import timedelta
import json
from django.core.exceptions import ImproperlyConfigured
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
from kombu import Queue
import os

# Import local and private data from a non-executable JSON file - secrets.json
# This is file is deployment specific and .gitignored
# TODO: Finish moving away from local/production setting template
with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "secrets.json")) as f:
    _secrets = json.loads(f.read())

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                # Insert your TEMPLATE_CONTEXT_PROCESSORS here or use this
                # list if you haven't customized them:
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.request',
            ],
        },
    },
]

AUTHENTICATION_BACKENDS = [
    'django_python3_ldap.auth.LDAPBackend',
]

# SITE_ID = 1

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = ''

CRISPY_TEMPLATE_PACK = 'bootstrap3'

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = ''

SESSION_ENGINE = 'redis_sessions.session'
SESSION_REDIS_PREFIX = 'session'


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/
def get_secret(key, default=None, secrets=_secrets):
    """Get a key from the local secrets.json file"""
    try:
        return secrets[key]
    except KeyError:
        if default:
            return default
        else:
            err_msg = "Secret key {0} not set"
            raise ImproperlyConfigured(err_msg)


HOST_IP = get_secret("HOST_IP")
REDIS_HOST = get_secret("REDIS_HOST")
REDIS_PORT = get_secret('REDIS_PORT')
CASSANDRA_HOST = get_secret("CASSANDRA_HOST")
CASSANDRA_PORT = get_secret('CASSANDRA_PORT')
SESSION_REDIS_HOST = REDIS_HOST
SESSION_REDIS_PORT = REDIS_PORT
WEBSOCKET_URL = 'ws://' + HOST_IP + ':8000'

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_secret('SECRET_KEY')

ALLOWED_HOSTS = []

PROJECT_APPS = (
    'documents',
)

LDAP_AUTH_URL = get_secret("LDAP_AUTH_URL")

LDAP_AUTH_USE_TLS = True

LDAP_AUTH_OBJECT_CLASS = 'organizationalPerson'
LDAP_AUTH_SEARCH_BASE = 'OU=Users,OU=NS,DC=nsprivate,DC=local'

LDAP_AUTH_USER_FIELDS = {
    'username': 'sAMAccountName',
    'first_name': 'givenName',
    'last_name': 'sn',
    'email': 'mail',
}

LDAP_AUTH_USER_LOOKUP_FIELDS = ('username',)

LDAP_AUTH_CLEAN_USER_DATA = 'django_python3_ldap.utils.clean_user_data'

LDAP_AUTH_SYNC_USER_RELATIONS = 'django_python3_ldap.utils.sync_user_relations'

LDAP_AUTH_FORMAT_SEARCH_FILTERS = 'django_python3_ldap.utils.format_search_filters'

LDAP_AUTH_FORMAT_USERNAME = 'django_python3_ldap.utils.format_username_active_directory'

LDAP_AUTH_ACTIVE_DIRECTORY_DOMAIN = 'nsprivate'

LDAP_AUTH_CONNECTION_USERNAME = get_secret("LDAP_AUTH_CONNECTION_USERNAME")
LDAP_AUTH_CONNECTION_PASSWORD = get_secret("LDAP_AUTH_CONNECTION_PASSWORD")

# Application definition

INSTALLED_APPS = (
    'jet',
    'asgi_redis',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'django_extensions',
    'netaddr',
    'celery',
    'djng',
    'documents',
    'crispy_forms',
    'corsheaders',
    'channels',
    'crcmod',
    'redis',
    'django_python3_ldap',
)

MIDDLEWARE_CLASSES = (
    'djng.middleware.AngularUrlMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'nsdocuments.urls'

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18nr

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/New_York'

USE_I18N = True

USE_L10N = True

USE_TZ = True

LOGIN_REDIRECT_URL = '/nsdocuments'
LOGIN_URL = '/nsdocuments/login'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/
STATIC_URL = '/static/'
STATIC_ROOT = '/var/www/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

CELERY_IMPORTS = ('nsdocuments.signals',)
BROKER_URL = 'amqp://guest:guest@localhost:5672/'
CELERY_ROUTES = (
    Queue('example_queue_name', routing_key='example_queue_name.#'),
)
CELERY_DISABLE_RATE_LIMITS = True
CELERY_TASK_SERIALIZER = 'pickle'
CELERY_ACCEPT_CONTENT = ['pickle', 'json']
CELERYBEAT_SCHEDULE = {
    'poll-queue': {
        'task': 'documents.tasks.example',
        'schedule': timedelta(seconds=60)
    },
}

SESSION_EXPIRE_AT_BROWSER_CLOSE = True

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ],
    'DEFAULT_FILTER_BACKENDS': ('django_filters.rest_framework.DjangoFilterBackend',),
    'DEFAULT_PAGINATION_CLASS': 'documents.pagination.StandardResultSetPagination',
    'PAGE_SIZE': 10
}

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'asgi_redis.RedisChannelLayer',
        'CONFIG': {
            'hosts': [(REDIS_HOST, REDIS_PORT)],
        },
        'ROUTING': 'nsdocuments.routing.channel_routing'
    }
}

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': get_secret('DATABASE_NAME', 'servername'),
        'USER': get_secret('DATABASE_USER', 'username'),
        'PASSWORD': get_secret('DATABASE_PASSWORD', 'password'),
        'HOST': get_secret('DATABASE_HOST', '127.0.0.1'),
        'PORT': get_secret('DATABASE_PORT', '5432'),
        'ATOMIC_REQUESTS': True,
    }
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django_python3_ldap': {
            'handlers': ['console'],
            'level': 'INFO',
        }
    }
}
