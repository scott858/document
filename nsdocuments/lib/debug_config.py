import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nsdocuments.settings.local")

try:
    import pymysql

    pymysql.install_as_MySQLdb()
except ImportError:
    pass

import logging

logger = logging.getLogger(__name__)
import django

django.setup()
